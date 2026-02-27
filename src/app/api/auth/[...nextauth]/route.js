// import NextAuth from 'next-auth'
// import { authOptions } from '@/lib/auth'

// const handler = NextAuth(authOptions)

// export { handler as GET, handler as POST }

// Temporary placeholder until auth is properly configured
export async function GET() {
  return Response.json({ error: 'Auth not configured' }, { status: 501 });
}

export async function POST() {
  return Response.json({ error: 'Auth not configured' }, { status: 501 });
}