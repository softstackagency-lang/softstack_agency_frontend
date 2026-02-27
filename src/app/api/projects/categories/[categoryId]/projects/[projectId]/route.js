import { NextResponse } from 'next/server';
// import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt-middleware';
// import { ObjectId } from 'mongodb';

// GET /api/projects/categories/:categoryId/projects/:projectId - Get a single project
export async function GET(request, { params }) {
  // This route should be handled by your backend server
  return NextResponse.json(
    { success: false, message: 'This endpoint is not implemented in the frontend. Please use the backend API.' },
    { status: 501 }
  );
  try {
    const { categoryId, projectId } = await params;

    // Connect to database
    const client = await clientPromise;
    const db = client.db();
    const projectsCollection = db.collection('demo_projects');

    // Find project by id or _id
    const project = await projectsCollection.findOne({
      $and: [
        { categoryId },
        {
          $or: [
            { id: projectId },
            { _id: ObjectId.isValid(projectId) ? new ObjectId(projectId) : null }
          ]
        }
      ]
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { project },
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/projects/categories/:categoryId/projects/:projectId - Update a project
export async function PUT(request, { params }) {
  // This route should be handled by your backend server
  return NextResponse.json(
    { success: false, message: 'This endpoint is not implemented in the frontend. Please use the backend API.' },
    { status: 501 }
  );
  
  /* Original implementation - should be in backend
  try {
    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const { categoryId, projectId } = await params;
    const body = await request.json();
    const { title, description, tags, thumbnail, previewUrl, isFeatured, order } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db();
    const projectsCollection = db.collection('demo_projects');

    // Find the project to update
    const existingProject = await projectsCollection.findOne({
      $and: [
        { categoryId },
        {
          $or: [
            { id: projectId },
            { _id: ObjectId.isValid(projectId) ? new ObjectId(projectId) : null }
          ]
        }
      ]
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {
      title,
      description,
      tags: tags || existingProject.tags || [],
      thumbnail: thumbnail || existingProject.thumbnail || '',
      previewUrl: previewUrl || existingProject.previewUrl || '',
      isFeatured: isFeatured !== undefined ? isFeatured : (existingProject.isFeatured || false),
      order: order !== undefined ? order : (existingProject.order || 0),
      updatedAt: new Date(),
    };

    // Update project
    const result = await projectsCollection.updateOne(
      { _id: existingProject._id },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'No changes made to the project' },
        { status: 400 }
      );
    }

    // Fetch updated project
    const updatedProject = await projectsCollection.findOne({ _id: existingProject._id });

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: { project: updatedProject },
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
  */
}

// DELETE /api/projects/categories/:categoryId/projects/:projectId - Delete a project
export async function DELETE(request, { params }) {
  // This route should be handled by your backend server
  return NextResponse.json(
    { success: false, message: 'This endpoint is not implemented in the frontend. Please use the backend API.' },
    { status: 501 }
  );
  
  /* Original implementation - should be in backend
  try {
    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const { categoryId, projectId } = await params;

    // Connect to database
    const client = await clientPromise;
    const db = client.db();
    const projectsCollection = db.collection('demo_projects');
    const categoriesCollection = db.collection('project_categories');

    // Find and delete the project
    const deletedProject = await projectsCollection.findOneAndDelete({
      $and: [
        { categoryId },
        {
          $or: [
            { id: projectId },
            { _id: ObjectId.isValid(projectId) ? new ObjectId(projectId) : null }
          ]
        }
      ]
    });

    if (!deletedProject) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    // Update category's project count
    await categoriesCollection.updateOne(
      { id: categoryId },
      { $inc: { projectCount: -1 } }
    );

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
  */
}
