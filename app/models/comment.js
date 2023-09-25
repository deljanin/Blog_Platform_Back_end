const db = require('../configs/dbconfig');

async function findAllComments(post_id) {
  const query = `
    SELECT * FROM comments
    WHERE post_id = $1
    ORDER BY created_at DESC
  `;
  const values = [post_id];
  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
}

async function createComment(content, post_id, user_id) {
  const creationTime = new Date().toISOString();
  const query = `
    INSERT INTO comments (content, created_at, post_id, user_id, flag)
    VALUES ($1, $2, $3, $4, false)
  `;
  const values = [content, creationTime, post_id, user_id];
  try {
    await db.query(query, values);
  } catch (error) {
    console.error('Error inserting a new comment:', error);
    throw error;
  }
}

module.exports = {
  createComment,
  findAllComments,
};
