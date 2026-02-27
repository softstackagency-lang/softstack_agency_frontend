import { NextResponse } from 'next/server';
// import clientPromise from '@/lib/mongodb';

// GET /api/projects - Get all categories and projects
export async function GET(request) {
  // This route should be handled by your backend server
  return NextResponse.json(
    { success: false, message: 'This endpoint is not implemented in the frontend. Please use the backend API.' },
    { status: 501 }
  );
  /* Original implementation - should be in backend
  try {
  try {
    // Connect to database
    const client = await clientPromise;
    const db = client.db();
    const categoriesCollection = db.collection('project_categories');
    const projectsCollection = db.collection('demo_projects');

    // Fetch all categories
    const categories = await categoriesCollection
      .find({})
      .sort({ order: 1, name: 1 })
      .toArray();

    // Fetch all projects
    const projects = await projectsCollection
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    // Group projects by category
    const categoriesWithProjects = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      order: category.order || 0,
      isActive: category.isActive !== false,
      projects: projects
        .filter(project => project.categoryId === category.id)
        .map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          tags: project.tags || [],
          thumbnail: project.thumbnail || '',
          previewUrl: project.previewUrl || '',
          isFeatured: project.isFeatured || false,
          order: project.order || 0,
        })),
    }));

    return NextResponse.json({
      success: true,
      data: categoriesWithProjects,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
  */
}
