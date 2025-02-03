"use client"

import { useCompletion } from 'ai/react';
import { remark } from 'remark';
import html from 'remark-html';

import { Button } from "@/components/ui/button"

import { Application } from "@/lib/application"
import { Sparkles } from 'lucide-react';

interface ReccomendationProps {
    applications: Application[]
}

export default function Reccomendation({ applications }: ReccomendationProps) {
    const { completion, complete, isLoading } = useCompletion({
        api: '/api/recommend',
        body: { applications },
    });

    // Convert the completion to HTML synchronously
    const contentHtml = completion ? remark()
        .use(html)
        .processSync(completion)
        .toString()
        : '';

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <h4 className="text-2xl font-bold mb-0">Step 3: Generate AI Recommendation 🤖</h4>
                <p className="text-sm text-muted-foreground">
                    Generate a recommendation for which applicants to accept.
                </p>
            </div>
            <Button
                onClick={() => complete('')}
                className="mb-4 font-semibold rounded-lg"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Sparkles className="w-4 h-4 text-white animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4 text-white" />
                        {completion ? 'Regenerate AI Recommendation' : 'Generate AI Recommendation'}
                    </>
                )}
            </Button>
            {completion && (
                <div className="prose prose-sm max-w-none border rounded-lg">
                    <div
                        className="p-4 bg-white rounded-lg shadow prose prose-md max-w-none"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </div>
            )}
        </div>
    )
}

