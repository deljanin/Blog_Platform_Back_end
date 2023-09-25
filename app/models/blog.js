const db = require('../configs/dbconfig');

async function findAllBlogs() {
  const query = `SELECT title, description FROM blogs`;
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error getting blogs:', error);
    throw error;
  }
}

async function createBlog(title, description, userId) {
  const creationTime = new Date().toISOString();
  const query = `
    INSERT INTO blogs (title, description, created_at, created_by, flag)
    VALUES ($1, $2, $3, $4, false)
    RETURNING *;
  `;
  const values = [title, description, creationTime, userId];

  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
}

async function updateBlogById(blogId, updatedFields) {
  const setClauses = [];
  const values = [];

  // Dynamically add setClauses and values for each field
  let paramIndex = 1; // Start with parameter index 1

  if (updatedFields.title !== undefined) {
    setClauses.push(`title = $${paramIndex}`);
    values.push(updatedFields.title);
    paramIndex++;
  }

  if (updatedFields.description !== undefined) {
    setClauses.push(`description = $${paramIndex}`);
    values.push(updatedFields.description);
    paramIndex++;
  }

  if (updatedFields.flag !== undefined) {
    setClauses.push(`flag = $${paramIndex}`);
    values.push(updatedFields.flag);
    paramIndex++;
  }

  if (setClauses.length === 0) {
    throw new Error('No valid fields to update');
  }

  const setClause = setClauses.join(', ');

  const query = `
    UPDATE blogs
    SET ${setClause}
    WHERE id = $${paramIndex}
    RETURNING *;
  `;

  values.push(blogId);

  const result = await db.query(query, values);

  if (result.rows.length === 0) {
    throw new Error('Blog not found');
  }

  return result.rows[0];
}

async function deleteBlogById(blogId) {
  const query = `
    DELETE FROM blogs
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const result = await db.query(query, [blogId]);

    if (result.rows.length === 0) {
      throw new Error('Blog not found');
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
}
module.exports = {
  findAllBlogs,
  createBlog,
  updateBlogById,
  deleteBlogById,
};
