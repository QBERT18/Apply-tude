import {
  applicationGenerateSchema,
  type GeneratedApplication,
} from "~/lib/schemas/application-generate.schema";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11435";

const SYSTEM_PROMPT = `You are a data extraction assistant for a job application tracker.
The user will provide either a job posting, a job listing URL's content, or a brief description of a position they want to apply to.

Your task: extract structured data and return it as a JSON object.

Required JSON fields:
- "jobName" (string): the job title or position name
- "companyName" (string): the company or organization name
- "companyWebpage" (string): company website URL starting with "https://"
- "applicationEmail" (string): email address to apply or that appeared in the listing
- "contactName" (string): name of the hiring manager or recruiter
- "contactPhone" (string): phone number of the contact
- "contactEmail" (string): contact person's email address
- "categories" (string[]): 1-5 relevant tags like "frontend", "remote", "react", "startup"

Rules:
1. Extract real data from the text whenever present.
2. For any field not found in the text, generate a plausible realistic value that fits the context. For example, if the company is "Google", generate a google.com email and URL.
3. If the input is too vague or nonsensical to extract anything, invent a complete realistic fake application.
4. Return ONLY the JSON object. No markdown fencing, no explanation, no extra text.`;

const FALLBACK_APPLICATION: GeneratedApplication = {
  jobName: "Software Engineer",
  companyName: "Acme Corp",
  companyWebpage: "https://example.com",
  applicationEmail: "careers@example.com",
  contactName: "Jane Doe",
  contactPhone: "+1 555-0100",
  contactEmail: "hr@example.com",
  categories: ["software", "engineering"],
};

export async function generateApplication(
  prompt: string
): Promise<GeneratedApplication> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        prompt,
        system: SYSTEM_PROMPT,
        stream: false,
        format: "json",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`Ollama responded with ${response.status}`);
      return FALLBACK_APPLICATION;
    }

    const data = await response.json();
    const modelOutput = JSON.parse(data.response);
    const parsed = applicationGenerateSchema.safeParse(modelOutput);

    if (!parsed.success) {
      console.error("Failed to parse Ollama output:", parsed.error);
      return FALLBACK_APPLICATION;
    }

    return parsed.data;
  } catch (error) {
    console.error("Ollama generation failed:", error);
    return FALLBACK_APPLICATION;
  }
}
