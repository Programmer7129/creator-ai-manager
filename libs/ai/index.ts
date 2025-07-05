import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ContentSuggestionRequest {
  creatorName: string
  niche: string
  recentMetrics?: any
  platform: string
}

export interface EmailDraftRequest {
  emailBody: string
  creatorName: string
  baseRate?: number
  followerCount?: number
}

export async function generateContentSuggestions(request: ContentSuggestionRequest) {
  const prompt = `You are a social media content strategist. 

Given the following information about a content creator:
- Name: ${request.creatorName}
- Niche: ${request.niche}
- Platform: ${request.platform}
- Recent metrics: ${request.recentMetrics ? JSON.stringify(request.recentMetrics) : 'Not available'}

Please provide 3 content ideas and suggest optimal posting times. Consider current trends in the ${request.niche} space.

Format your response as JSON with the following structure:
{
  "contentIdeas": [
    {
      "title": "Content idea title",
      "description": "Brief description of the content",
      "type": "post/story/reel/video",
      "hashtags": ["#hashtag1", "#hashtag2"]
    }
  ],
  "optimalPostingTimes": [
    {
      "day": "Monday",
      "time": "6:00 PM",
      "reason": "Reason for this timing"
    }
  ],
  "trendingTopics": ["topic1", "topic2", "topic3"]
}`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful social media content strategist.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No content generated')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating content suggestions:', error)
    throw new Error('Failed to generate content suggestions')
  }
}

export async function draftSponsorshipEmail(request: EmailDraftRequest) {
  const rateFormula = request.baseRate && request.followerCount 
    ? `$${Math.round(request.baseRate * (request.followerCount / 1000))}`
    : '$X (to be determined based on deliverables)'

  const prompt = `You are a professional talent manager. Draft a polite and professional reply to this sponsorship inquiry:

"${request.emailBody}"

For creator: ${request.creatorName}
Proposed rate: ${rateFormula}

Guidelines:
- Be professional and enthusiastic
- Express interest in collaboration
- Mention our rate structure
- Ask for specific deliverables and timeline
- Keep it under 150 words
- Don't sound overly eager

Format as a professional email.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a professional talent manager with expertise in influencer marketing.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 300
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No content generated')

    return content
  } catch (error) {
    console.error('Error drafting email:', error)
    throw new Error('Failed to draft email')
  }
}

export async function draftEmail(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a professional talent manager with expertise in influencer marketing communications.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No content generated')

    return content
  } catch (error) {
    console.error('Error drafting email:', error)
    throw new Error('Failed to draft email')
  }
}

export async function summarizeContract(contractText: string) {
  const prompt = `Please analyze this contract and provide a summary of the key clauses, highlighting any potential issues or points to negotiate:

"${contractText}"

Focus on:
- Exclusivity clauses
- Usage rights and duration
- Payment terms
- Deliverables and timeline
- Cancellation terms
- Any unusual or concerning clauses

Format as a structured summary with clear sections.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a legal expert specializing in influencer marketing contracts.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 800
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No content generated')

    return content
  } catch (error) {
    console.error('Error summarizing contract:', error)
    throw new Error('Failed to summarize contract')
  }
} 