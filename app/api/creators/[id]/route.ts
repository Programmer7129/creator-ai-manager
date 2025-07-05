import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { db } from '@/libs/db'
import { z } from 'zod'

const updateCreatorSchema = z.object({
  name: z.string().min(2, 'Creator name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  niche: z.string().min(2, 'Niche must be at least 2 characters').optional(),
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

async function getCreatorWithPermissionCheck(creatorId: string, userId: string) {
  const creator = await db.creator.findUnique({
    where: { id: creatorId },
    include: { 
      agency: {
        include: {
          users: true
        }
      }
    }
  })

  if (!creator) {
    throw new Error('Creator not found')
  }

  // Check if user has access to this creator
  const hasAccess = creator.agency?.users.some((user: any) => user.id === userId)
  if (!hasAccess) {
    throw new Error('Access denied')
  }

  return creator
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const creator = await getCreatorWithPermissionCheck(params.id, session.user.id)

    const creatorWithDetails = await db.creator.findUnique({
      where: { id: params.id },
      include: {
        deals: {
          orderBy: { createdAt: 'desc' }
        },
        scheduledPosts: {
          orderBy: { scheduledFor: 'desc' }
        },
        aiSuggestions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            deals: true,
            scheduledPosts: true,
            aiSuggestions: true,
          }
        }
      }
    })

    return NextResponse.json(creatorWithDetails)
  } catch (error) {
    console.error('Error fetching creator:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Creator not found') {
        return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
      }
      if (error.message === 'Access denied') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await getCreatorWithPermissionCheck(params.id, session.user.id)

    const body = await request.json()
    const validatedData = updateCreatorSchema.parse(body)

    const updatedCreator = await db.creator.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        _count: {
          select: {
            deals: true,
            scheduledPosts: true,
          }
        }
      }
    })

    return NextResponse.json(updatedCreator)
  } catch (error) {
    console.error('Error updating creator:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    if (error instanceof Error) {
      if (error.message === 'Creator not found') {
        return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
      }
      if (error.message === 'Access denied') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await getCreatorWithPermissionCheck(params.id, session.user.id)

    // Delete creator (this will cascade delete related records)
    await db.creator.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Creator deleted successfully' })
  } catch (error) {
    console.error('Error deleting creator:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Creator not found') {
        return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
      }
      if (error.message === 'Access denied') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 