"use client"

import { useCompletion } from 'ai/react';
import { remark } from 'remark';
import html from 'remark-html';

import { Button } from "@/components/ui/button"

import { Application } from "@/lib/application"

interface ReccomendationProps {
    applications: Application[]
}

export default function Reccomendation({ applications }: ReccomendationProps) {
    const { completion, complete } = useCompletion({
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
        <div>
            <h2 className="text-2xl font-bold mb-4">AI Recommendation</h2>
            <Button onClick={() => complete('')} className="mb-4">Generate AI Recommendation</Button>
            <div className="prose prose-sm max-w-none">
              {completion && (
                <div 
                  className="p-4 bg-white rounded-lg shadow prose prose-md max-w-none"
                  dangerouslySetInnerHTML={{ __html: contentHtml }} 
                />
              )}
            </div>
        </div>
    )
}

