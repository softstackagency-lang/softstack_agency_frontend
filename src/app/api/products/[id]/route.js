import { NextResponse } from 'next/server'
import { updateProduct, deleteProduct } from '@/controllers/productsController'

// PUT /api/products/[id] - Update a product (admin only)
export async function PUT(request, { params }) {
  return updateProduct(request, { params })
}

// DELETE /api/products/[id] - Delete a product (admin only)
export async function DELETE(request, { params }) {
  return deleteProduct(request, { params })
}