import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt-middleware'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

// Get single user by ID from Express backend
export async function GET(request, { params }) {
  try {
    const { id } = await params

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
    const expressResponse = await fetch(`${API_BASE_URL}/users/${id}`, {
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

    const userData = await expressResponse.json()

    const response = NextResponse.json({
      success: true,
      message: 'User retrieved successfully',
      data: userData
    })

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', API_BASE_URL.replace('/api', ''))
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    return response

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to get user data' },
      { status: 500 }
    )
  }
}

// Update user data
export async function PUT(request, { params }) {
  try {
    const { id } = await params

    // Verify authentication
    const auth = verifyToken(request)
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message }, 
        { status: auth.status }
      )
    }

    // Get request body
    const updateData = await request.json()

    // Get the auth-token cookie
    const authToken = request.cookies.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'No authentication token' },
        { status: 401 }
      )
    }

    // Forward request to Express backend
    const expressResponse = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
        cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `auth-token=${authToken}`
      },
      body: JSON.stringify(updateData)
    })

    if (!expressResponse.ok) {
      const errorText = await expressResponse.text()
      return NextResponse.json(
        { success: false, message: `Backend error: ${expressResponse.status}` },
        { status: expressResponse.status }
      )
    }

    const updatedUser = await expressResponse.json()

    const response = NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    })

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', API_BASE_URL.replace('/api', ''))
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    return response

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// Delete user
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    // Verify authentication
    const auth = verifyToken(request)
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message }, 
        { status: auth.status }
      )
    }

    // Only admin can delete users
    if (auth.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
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
    const expressResponse = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
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

    const result = await expressResponse.json()

    const response = NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      data: result
    })

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', API_BASE_URL.replace('/api', ''))
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    return response

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 200 })
  
  response.headers.set('Access-Control-Allow-Origin', API_BASE_URL.replace('/api', ''))
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')
  
  return response
}