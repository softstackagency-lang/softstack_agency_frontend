import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt-middleware'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

// GET all users from Express backend
export async function GET(request) {
  try {

    // Verify authentication
    const auth = verifyToken(request)
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message }, 
        { status: auth.status }
      )
    }

    // Get the auth-token cookie
    const authToken = request.cookies.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'No authentication token' },
        { status: 401 }
      )
    }

    // Forward request to Express backend
    const expressResponse = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
        cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `auth-token=${authToken}`
      }
    })

    if (!expressResponse.ok) {
      const errorText = await expressResponse.text()
      return NextResponse.json(
        { success: false, message: `Backend error: ${expressResponse.status}` },
        { status: expressResponse.status }
      )
    }

    const usersData = await expressResponse.json()

    const response = NextResponse.json({
      success: true,
      message: 'Users retrieved successfully',
      count: usersData.length || 0,
      users: usersData
    })

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', API_BASE_URL.replace('/api', ''))
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    return response

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to get users data' },
      { status: 500 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 200 })
  
  response.headers.set('Access-Control-Allow-Origin', API_BASE_URL.replace('/api', ''))
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')
  
  return response
}