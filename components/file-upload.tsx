"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

import { Application } from "@/lib/application"

interface FileUploadProps {
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>
}

export default function FileUpload({ setApplications }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
      setError(null)
    }
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append("files", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setApplications(prev => {
        const filtered = prev.filter(app =>
          `${app.firstName} ${app.lastName}` !== `${data.application.firstName} ${data.application.lastName}`
        )
        return [...filtered, data.application]
      })
      return data.application
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(`Failed to upload ${file.name}: ${errorMessage}`)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (files.length === 0) {
      setError("Please select at least one file")
      return
    }

    setUploading(true)
    setError(null)
    setProgress(0)

    const completedUploads = await Promise.all(
      files.map(async (file) => {
        const application = await uploadFile(file)
        setProgress(prev => prev + (100 / files.length))
        return application
      })
    )

    const successfulUploads = completedUploads.filter((app): app is Application => app !== null)

    if (successfulUploads.length > 0) {
      const existingApps = JSON.parse(localStorage.getItem("applications") || "[]")
      const mergedApps = [...existingApps, ...successfulUploads].reduce((acc: Application[], current: Application) => {
        const existingIndex = acc.findIndex((app: Application) =>
          `${app.firstName} ${app.lastName}` === `${current.firstName} ${current.lastName}`
        )
        if (existingIndex >= 0) {
          acc[existingIndex] = current
        } else {
          acc.push(current)
        }
        return acc
      }, [] as Application[])

      localStorage.setItem("applications", JSON.stringify(mergedApps))
      setFiles([])
      setApplications(mergedApps)
      router.refresh()
    }

    if (completedUploads.length !== files.length) {
      setError(`${files.length - successfulUploads.length} file(s) failed to process`)
    }

    setUploading(false)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h4 className="text-2xl font-bold mb-0">Step 1: Upload Applications 📁</h4>
        <p className="text-sm text-muted-foreground">
          Upload all the applications to view them in the table. (Excel, PDF, or TXT)
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <Input type="file" onChange={handleFileChange} multiple accept=".xlsx,.pdf,.txt" disabled={uploading} />
          <Button type="submit" disabled={uploading || files.length === 0} className="font-semibold">
            {uploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Applications
              </>
            )}
          </Button>
        </div>

        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              file {Math.ceil((progress / 100) * files.length)}/{files.length}
            </p>
          </div>
        )}
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

    </div>
  )
}

