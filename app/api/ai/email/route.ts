import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { draftEmail } from '@/libs/ai'
import { z } from 'zod'

const emailRequestSchema = z.object({
  type: z.enum(['outreach', 'negotiation', 'followup', 'collaboration', 'thank_you']),
  context: z.object({
    creatorName: z.string(),
    creatorNiche: z.string(),
    brandName: z.string(),
    campaignDetails: z.string().optional(),
    previousContext: z.string().optional(),
    tone: z.enum(['professional', 'friendly', 'casual', 'formal']).default('professional'),
    keyPoints: z.array(z.string()).optional(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = emailRequestSchema.parse(body)

    const { type, context } = validatedData

    // Create context-specific prompt
    let prompt = ''
    
    switch (type) {
      case 'outreach':
        prompt = `Draft a professional outreach email to ${context.brandName} introducing ${context.creatorName}, a ${context.creatorNiche} content creator. The email should be ${context.tone} and highlight the creator's strengths and potential collaboration opportunities.`
        break
      
      case 'negotiation':
        prompt = `Draft a professional negotiation email for ${context.creatorName} (${context.creatorNiche} creator) to ${context.brandName}. The email should be ${context.tone} and focus on terms, rates, and deliverables.`
        break
      
      case 'followup':
        prompt = `Draft a follow-up email for ${context.creatorName} to ${context.brandName}. Previous context: ${context.previousContext || 'Previous communication about potential collaboration'}. The tone should be ${context.tone} and politely check on the status.`
        break
      
      case 'collaboration':
        prompt = `Draft a collaboration proposal email from ${context.creatorName} (${context.creatorNiche} creator) to ${context.brandName}. Campaign details: ${context.campaignDetails || 'Brand partnership'}. The tone should be ${context.tone} and include specific collaboration ideas.`
        break
      
      case 'thank_you':
        prompt = `Draft a thank you email from ${context.creatorName} to ${context.brandName} after a successful collaboration. The tone should be ${context.tone} and express gratitude while leaving the door open for future partnerships.`
        break
    }

    // Add key points if provided
    if (context.keyPoints && context.keyPoints.length > 0) {
      prompt += ` Make sure to include these key points: ${context.keyPoints.join(', ')}.`
    }

    prompt += ' Include a subject line. Format the response as a professional email.'

    const emailDraft = await draftEmail(prompt)

    return NextResponse.json({ 
      email: emailDraft,
      type,
      context 
    })
  } catch (error) {
    console.error('Error generating email:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 })
  }
} 