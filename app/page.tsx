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
    const applications = localStorage.getItem("applications")
    if (applications) {
      setApplications(JSON.parse(applications))
    }
  }, [])

  return (
    <main className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Tenant Ranking Platform</h1>
      <Reccomendation applications={applications} />
      <DataTable data={applications} columns={columns} setData={setApplications} />
      <FileUpload setApplications={setApplications} />
    </main>
  )
}

