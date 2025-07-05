import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { db } from '@/libs/db'
import { z } from 'zod'

const createAgencySchema = z.object({
  name: z.string().min(2, 'Agency name must be at least 2 characters'),
  description: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createAgencySchema.parse(body)

    // Check if user already has an agency
    const existingUser = await db.user.findUnique({
      where: { id: session.user.id },
      include: { agency: true }
    })

    if (existingUser?.agency) {
      return NextResponse.json({ error: 'User already has an agency' }, { status: 400 })
    }

    // Create agency
    const agency = await db.agency.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        users: {
          connect: { id: session.user.id }
        }
      },
      include: {
        users: true
      }
    })

    // Update user role to ADMIN
    await db.user.update({
      where: { id: session.user.id },
      data: { role: 'ADMIN' }
    })

    return NextResponse.json(agency, { status: 201 })
  } catch (error) {
    console.error('Error creating agency:', error)
    
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

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { 
        agency: {
          include: {
            users: true,
            creators: true
          }
        }
      }
    })

    if (!user?.agency) {
      return NextResponse.json({ error: 'No agency found' }, { status: 404 })
    }

    return NextResponse.json(user.agency)
  } catch (error) {
    console.error('Error fetching agency:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 