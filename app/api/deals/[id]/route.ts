import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { db } from '@/libs/db'
import { z } from 'zod'

const updateDealSchema = z.object({
  title: z.string().min(2, 'Deal title must be at least 2 characters').optional(),
  brand: z.string().min(2, 'Brand name must be at least 2 characters').optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
  deadline: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  deliverables: z.string().optional(),
})

async function getDealWithPermissionCheck(dealId: string, userId: string) {
  const deal = await db.deal.findUnique({
    where: { id: dealId },
    include: { 
      creator: {
        include: {
          agency: {
            include: {
              users: true
            }
          }
        }
      }
    }
  })

  if (!deal) {
    throw new Error('Deal not found')
  }

  // Check if user has access to this deal
  const hasAccess = deal.creator.agency?.users.some((user: any) => user.id === userId)
  if (!hasAccess) {
    throw new Error('Access denied')
  }

  return deal
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

    await getDealWithPermissionCheck(params.id, session.user.id)

    const dealWithDetails = await db.deal.findUnique({
      where: { id: params.id },
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

    return NextResponse.json(dealWithDetails)
  } catch (error) {
    console.error('Error fetching deal:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Deal not found') {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
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

    await getDealWithPermissionCheck(params.id, session.user.id)

    const body = await request.json()
    const validatedData = updateDealSchema.parse(body)

    const updateData: any = { ...validatedData }
    if (validatedData.deadline) {
      updateData.deadline = new Date(validatedData.deadline)
    }

    const updatedDeal = await db.deal.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(updatedDeal)
  } catch (error) {
    console.error('Error updating deal:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    if (error instanceof Error) {
      if (error.message === 'Deal not found') {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
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

    await getDealWithPermissionCheck(params.id, session.user.id)

    // Delete deal
    await db.deal.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Deal deleted successfully' })
  } catch (error) {
    console.error('Error deleting deal:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Deal not found') {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
      }
      if (error.message === 'Access denied') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 