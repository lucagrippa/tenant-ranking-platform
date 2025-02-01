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
  const [success, setSuccess] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
      setError(null)
      setSuccess(null)
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
    setSuccess(null)
    setProgress(0)

    const results = {
      applications: [] as Application[],
      failed: 0
    }

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append("files", files[i])

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const data = await response.json()

        if (response.ok) {
          results.applications.push(data.application)
          setApplications(prevApplications => [...prevApplications, data.application] as Application[])
        } else {
          results.failed++
          console.error(`Failed to upload ${files[i].name}: ${data.error}`)
        }
      } catch (error: unknown) {
        results.failed++
        console.error(`Failed to upload ${files[i].name}:`, error)
      }

      // Update progress after each file
      setProgress(((i + 1) / files.length) * 100)
    }

    // Save results and update final state
    if (results.applications.length > 0) {
      localStorage.setItem("applications", JSON.stringify(results.applications))
      setSuccess(`Successfully processed ${results.applications.length} files${results.failed > 0 ? ` (${results.failed} failed)` : ""}`)
      setFiles([])
      router.refresh()
    } else {
      setError("No files were successfully processed")
    }

    setUploading(false)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <Input type="file" onChange={handleFileChange} multiple accept=".xlsx,.pdf,.txt" disabled={uploading} />
          <Button type="submit" disabled={uploading || files.length === 0}>
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

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

