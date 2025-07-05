import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { db } from '@/libs/db'
import { z } from 'zod'

const createDealSchema = z.object({
  brand: z.string().min(2, 'Brand name must be at least 2 characters'),
  creatorId: z.string().min(1, 'Creator is required'),
  contactEmail: z.string().email().optional(),
  contactName: z.string().optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  currency: z.string().default('USD'),
  status: z.enum(['PENDING', 'NEGOTIATING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).default('PENDING'),
  description: z.string().optional(),
  deliverables: z.any().optional(),
  nextActionAt: z.string().optional(),
  contractUrl: z.string().url().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's agency
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { agency: true }
    })

    if (!user?.agency) {
      return NextResponse.json({ error: 'No agency found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = createDealSchema.parse(body)

    // Verify creator belongs to user's agency
    const creator = await db.creator.findUnique({
      where: { id: validatedData.creatorId }
    })

    if (!creator || creator.agencyId !== user.agency.id) {
      return NextResponse.json({ error: 'Creator not found or access denied' }, { status: 403 })
    }

    // Create deal
    const deal = await db.deal.create({
      data: {
        brand: validatedData.brand,
        contactEmail: validatedData.contactEmail,
        contactName: validatedData.contactName,
        amount: validatedData.amount,
        currency: validatedData.currency,
        status: validatedData.status,
        description: validatedData.description,
        deliverables: validatedData.deliverables,
        nextActionAt: validatedData.nextActionAt ? new Date(validatedData.nextActionAt) : null,
        contractUrl: validatedData.contractUrl,
        notes: validatedData.notes,
        creator: {
          connect: { id: validatedData.creatorId }
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            niche: true,
            socialHandles: true,
          }
        }
      }
    })

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    console.error('Error creating deal:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's agency
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { agency: true }
    })

    if (!user?.agency) {
      return NextResponse.json({ error: 'No agency found' }, { status: 404 })
    }

    // Get all deals for creators in this agency
    const deals = await db.deal.findMany({
      where: {
        creator: {
          agencyId: user.agency.id
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            niche: true,
            socialHandles: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(deals)
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 