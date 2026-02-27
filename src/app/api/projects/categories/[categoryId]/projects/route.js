import { NextResponse } from 'next/server';
// import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt-middleware';

// POST /api/projects/categories/:categoryId/projects - Create a new project under a category
export async function POST(request, { params }) {
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

    const { categoryId } = await params;
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
    const categoriesCollection = db.collection('project_categories');
    const projectsCollection = db.collection('demo_projects');

    // Check if category exists
    const category = await categoriesCollection.findOne({ id: categoryId });
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    // Generate project ID from title
    const projectId = title.toLowerCase().replace(/\s+/g, '-');

    // Check if project with this ID already exists
    const existingProject = await projectsCollection.findOne({ id: projectId });
    if (existingProject) {
      return NextResponse.json(
        { success: false, message: 'Project with this title already exists' },
        { status: 400 }
      );
    }

    // Create new project
    const newProject = {
      id: projectId,
      categoryId: categoryId,
      title,
      description,
      tags: tags || [],
      thumbnail: thumbnail || '',
      previewUrl: previewUrl || '',
      isFeatured: isFeatured || false,
      order: order || 0,
      createdBy: decoded.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await projectsCollection.insertOne(newProject);

    // Update category's project count
    await categoriesCollection.updateOne(
      { id: categoryId },
      { $inc: { projectCount: 1 } }
    );

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: {
        project: {
          _id: result.insertedId,
          ...newProject,
        },
      },
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
  */
}

// GET /api/projects/categories/:categoryId/projects - Get all projects for a category
export async function GET(request, { params }) {
  // This route should be handled by your backend server
  return NextResponse.json(
    { success: false, message: 'This endpoint is not implemented in the frontend. Please use the backend API.' },
    { status: 501 }
  );
  
  /* Original implementation - should be in backend
  try {
    const { categoryId } = await params;

    // Connect to database
    const client = await clientPromise;
    const db = client.db();
    const projectsCollection = db.collection('demo_projects');

    // Fetch all projects for the category
    const projects = await projectsCollection
      .find({ categoryId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        projects,
        count: projects.length,
      },
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
  */
}
