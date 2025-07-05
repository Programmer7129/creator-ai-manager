import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { db } from '@/libs/db'
import { z } from 'zod'

const createCreatorSchema = z.object({
  name: z.string().min(2, 'Creator name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional(),
  niche: z.string().min(2, 'Niche must be at least 2 characters'),
  socialHandles: z.object({
    instagram: z.object({
      handle: z.string().optional(),
      token: z.string().optional(),
    }).optional(),
    youtube: z.object({
      handle: z.string().optional(),
      token: z.string().optional(),
    }).optional(),
    tiktok: z.object({
      handle: z.string().optional(),
      token: z.string().optional(),
    }).optional(),
  }).optional(),
  baseRate: z.number().positive().optional(),
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
    const validatedData = createCreatorSchema.parse(body)

    // Create creator
    const creator = await db.creator.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        niche: validatedData.niche,
        socialHandles: validatedData.socialHandles || {},
        baseRate: validatedData.baseRate,
        agencyId: user.agency.id,
      },
    })

    return NextResponse.json(creator, { status: 201 })
  } catch (error) {
    console.error('Error creating creator:', error)
    
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

    // Get all creators for this agency
    const creators = await db.creator.findMany({
      where: { agencyId: user.agency.id },
      include: {
        deals: {
          select: {
            id: true,
            status: true,
            amount: true,
          }
        },
        scheduledPosts: {
          select: {
            id: true,
            status: true,
            scheduledFor: true,
          }
        },
        _count: {
          select: {
            deals: true,
            scheduledPosts: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(creators)
  } catch (error) {
    console.error('Error fetching creators:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 