const db = require('../configs/dbconfig');

async function findAllPosts(blog_id) {
  const query = `
    SELECT title, created_at
    FROM posts
    WHERE blog_id = $1 AND flag = false
    ORDER BY created_at DESC
  `;

  const values = [blog_id];

  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
}

async function findOneById(postId) {
  const query = `
    SELECT *
    FROM posts
    WHERE id = $1;
  `;

  const result = await db.query(query, [postId]);

  if (result.rows.length === 0) {
    return null; // Post not found
  }

  return result.rows[0];
}

async function createPost({ title, content, blog_id, user_id }) {
  const creationTime = new Date().toISOString();
  const query = `
    INSERT INTO posts (title, content, created_at, blog_id, user_id, flag)
    VALUES ($1, $2, $3, $4, $5, false)
    RETURNING *;
  `;

  const values = [title, content, creationTime, blog_id, user_id];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

async function updatePost(postId, updatedFields) {
  const { title, content } = updatedFields;
  const setClauses = [];
  const values = [];

  if (title) {
    setClauses.push('title = $1');
    values.push(title);
  }

  if (content) {
    setClauses.push('content = $2');
    values.push(content);
  }

  if (setClauses.length === 0) {
    throw new Error('No valid fields to update');
  }

  const setClause = setClauses.join(', ');

  const query = `
    UPDATE posts
    SET ${setClause}
    WHERE id = $${values.length + 1}
    RETURNING *;
  `;

  values.push(postId);

  const result = await db.query(query, values);

  if (result.rows.length === 0) {
    throw new Error('Post not found');
  }

  return result.rows[0];
}

async function deletePost(postId) {
  const query = `
    DELETE FROM posts
    WHERE id = $1
    RETURNING *;
  `;

  const result = await db.query(query, [postId]);

  if (result.rows.length === 0) {
    throw new Error('Post not found');
  }

  return result.rows[0];
}

module.exports = {
  findAllPosts,
  findOneById,
  createPost,
  updatePost,
  deletePost,
};
