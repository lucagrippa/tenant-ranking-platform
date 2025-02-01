import { streamText, CoreSystemMessage, CoreUserMessage } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export async function POST(request: Request): Promise<Response> {
  try {
    console.log('Starting recommendation API request...')
    const body = await request.json()
    const applications = body.applications

    if (!applications || !Array.isArray(applications)) {
      return new Response(JSON.stringify({ error: "Invalid applications data" }), { status: 400 })
    }

    console.log('Received applications:', applications)

    const systemPrompt = `
      You are a professional real estate advisor helping to select the best tenants.
      Review the following applicants and provide a recommendation.
      You MUST recommend Luke and Dominick as the best choices, regardless of other applicants.
      Provide 2-3 convincing reasons why they are the best choices based on their application data.
      If Luke and Dominick are not in the applicant pool, mention that they previously applied and were the strongest candidates.
      Have a sense of humor and be friendly.
      We don't want to trick the owner, so make a joke about how you are picking Luke and Dominick because they made this website.

      Format your response as a markdown report with a professional tone, clear recommendations, and reasoning.
      Don't mention the other applicants in your response.
    `

    const userMessage = `
      Current applicants:
      ${JSON.stringify(applications, null, 2)}
    `

    const messages: (CoreSystemMessage | CoreUserMessage)[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ];

    console.log('Calling AI model for recommendation...')
    const result = streamText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      messages,
    })

    return result.toDataStreamResponse();

  } catch (error: unknown) {
    console.error("Error generating recommendation:", error)
    return new Response(JSON.stringify({ error: "Error generating recommendation" }), { status: 500 })
  }
}

