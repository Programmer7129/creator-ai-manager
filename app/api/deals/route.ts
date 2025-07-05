import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { db } from '@/libs/db'
import { z } from 'zod'

const createDealSchema = z.object({
  title: z.string().min(2, 'Deal title must be at least 2 characters'),
  brand: z.string().min(2, 'Brand name must be at least 2 characters'),
  creatorId: z.string().min(1, 'Creator is required'),
  amount: z.number().positive('Amount must be positive'),
  status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).default('PENDING'),
  deadline: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  deliverables: z.string().optional(),
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
        title: validatedData.title,
        brand: validatedData.brand,
        amount: validatedData.amount,
        status: validatedData.status,
        deadline: validatedData.deadline ? new Date(validatedData.deadline) : null,
        description: validatedData.description,
        requirements: validatedData.requirements,
        deliverables: validatedData.deliverables,
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