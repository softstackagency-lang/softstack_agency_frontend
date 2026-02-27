import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt-middleware'

export async function GET(request) {
  try {
    const auth = verifyToken(request)

    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message }, 
        { status: auth.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Profile retrieved successfully',
      user: auth.user
    })
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
