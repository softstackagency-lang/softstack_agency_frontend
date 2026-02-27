import jwt from 'jsonwebtoken'

export function verifyToken(request) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return { 
        success: false, 
        status: 401, 
        message: 'No authentication token provided' 
      }
    }

    if (!process.env.JWT_SECRET) {
      return { 
        success: false, 
        status: 500, 
        message: 'Server configuration error' 
      }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return { success: true, user: decoded }

  } catch (error) {
    
    if (error.name === 'TokenExpiredError') {
      return { 
        success: false, 
        status: 401, 
        message: 'Token has expired' 
      }
    } else if (error.name === 'JsonWebTokenError') {
      return { 
        success: false, 
        status: 401, 
        message: 'Invalid token' 
      }
    } else {
      return { 
        success: false, 
        status: 401, 
        message: 'Token verification failed' 
      }
    }
  }
}
