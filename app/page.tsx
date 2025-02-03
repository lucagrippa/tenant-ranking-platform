"use client"

import { useState, useEffect } from "react"

import { Application } from "@/lib/application"
import { columns } from "@/lib/columns"

import FileUpload from "@/components/file-upload"
import Reccomendation from "@/components/reccomendation"
import { DataTable } from "@/components/data-table"


export default function Home() {
  const [applications, setApplications] = useState<Application[]>([])

  // get applications from local storage if they exist
  useEffect(() => {
    try {
      const storedApplications = localStorage.getItem("applications")
      if (storedApplications) {
        const parsedApplications = JSON.parse(storedApplications)
        setApplications(Array.isArray(parsedApplications) ? parsedApplications : [])
      }
    } catch (error) {
      console.error('Failed to load applications from localStorage:', error)
      // Optionally set an error state here
    }
  }, [])

  return (
    <main className="container mx-auto p-4 space-y-8 mb-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Tenant Ranking Platform</h1>
        <p className="text-sm text-muted-foreground">
          {/* TODO: Add a description of the platform, I'm a tenant who made this platform for the owner of the apartment I want to rent. */}
          Hope this can help you find the best tenant for your apartment.
        </p>
      </div>
      <FileUpload setApplications={setApplications} />
      <DataTable data={applications} columns={columns} setData={setApplications} />
      <Reccomendation applications={applications} />
    </main>
  )
}

