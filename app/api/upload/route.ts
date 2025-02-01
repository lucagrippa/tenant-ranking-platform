import { z } from "zod"
import { v4 as uuidv4 } from 'uuid';
import { generateObject, CoreSystemMessage, CoreUserMessage, GenerateObjectResult } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

import { readFile } from "@/lib/read-file"
import { Application, applicationSchema } from "@/lib/application"

// TODO: make sure this works well and have lots of error handling
// if this doesnt work, the user cant use the app
export async function POST(request: Request): Promise<Response> {
    const formData = await request.formData()
    const file = formData.get("files") as File

    if (!file) {
        return new Response(
            JSON.stringify({
                error: "No file was uploaded"
            }),
            { status: 400 }
        )
    }

    console.log('Processing file:', file.name)

    try {
        const applicationText = await readFile(file)
        const systemPrompt = `
    Extract the following information from the given application content into a JSON format.
    If any field is missing or unclear, use "Not provided" as the value.
    
    Required fields:
    - firstName
    - lastName
    - phone
    - email
    - profession  
    - specialty
    - employer
    - startingDate
    - income
    - funds
    - hometown
    - proposedRent
    - otherOccupants
    - roommates
  `

        const messages: (CoreSystemMessage | CoreUserMessage)[] = [
            { role: "system", content: systemPrompt },
            { role: "user", content: applicationText }
        ];


        console.log("Sending request to AI model...")
        const result: GenerateObjectResult<z.infer<typeof applicationSchema>> = await generateObject({
            model: anthropic("claude-3-5-sonnet-20241022"),
            schema: applicationSchema,
            messages,
        })
        const application: Application = {
            ...result.object,
            id: uuidv4(),
        }
        console.log('Processed result for', file.name, ':', result)

        return new Response(
            JSON.stringify({
                message: "File processed successfully",
                application: application,
            }),
            { status: 200 }
        )

    } catch (error: any) {
        console.error('Error processing file:', file.name, error)
        return new Response(
            JSON.stringify({
                error: "File processing failed",
                details: error.message
            }),
            { status: 500 }
        )
    }
}