import { NextResponse } from 'next/server'
import { createProduct, getAllProducts } from '@/controllers/productsController'

// GET /api/products - Get all products (public with optional token)
export async function GET(request) {
  return getAllProducts(request)
}

// POST /api/products - Create a new product (admin only)
export async function POST(request) {
  return createProduct(request)
}