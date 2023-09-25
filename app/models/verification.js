const db = require('../configs/dbconfig');

async function findVerificationCode(email) {
  const now = new Date().toISOString();
  const query = `SELECT * FROM verification WHERE email = '${email}' AND expired_at > '${now}'`;
  try {
    const result = await db.query(query);

    return result.rows[0];
  } catch (error) {
    console.error('Error finding verification email:', error);
    throw error;
  }
}

async function createVerificationCode(email, code) {
  const creationTime = new Date().toISOString();
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 1);
  //   console.log('Current time +1 hour: ' + expirationTime);
  const formattedExpirationTime = expirationTime.toISOString();

  //   console.log('Formatted Expiration Time:', formattedExpirationTime);
  const query = `INSERT INTO verification (email, verification_code, created_at, expired_at, status)
   VALUES ('${email}','${code}','${creationTime}','${formattedExpirationTime}','pending')`;
  try {
    await db.query(query);
  } catch (error) {
    console.error('Error inserting a new verification email:', error);
    throw error;
  }
}

async function setEmailVerified(email) {
  const query = `UPDATE verification SET status = 'verified' WHERE email = '${email}'`;
  try {
    await db.query(query);
  } catch (error) {
    console.error('Error setting verification status:', error);
  }
}

async function findVerifiedEmail(email) {
  const query = `SELECT * FROM verification WHERE email = '${email}' AND status = 'verified'`;
  try {
    const result = await db.query(query);
    return result.rows[0];
  } catch (error) {
    console.error('Error finding verified email:', error);
  }
}

async function deleteVerifiedEmail(email) {
  const query = `DELETE FROM verification WHERE email = '${email}'`;
  try {
    await db.query(query);
  } catch (error) {
    console.error('Error deleting verification email:', error);
  }
}

async function cleanupExpiredVerificationRequests() {
  const now = new Date().toISOString();
  const query = `DELETE FROM verification WHERE expired_at < '${now}' AND status = 'pending'`;
  //   console.log(query);
  try {
    await db.query(query);
    console.log('Expired verification requests cleaned up.');
  } catch (error) {
    console.error('Error cleaning up expired verification requests:', error);
  }
}

// Schedule the cleanup job to run periodically (e.g., every hour)
setInterval(cleanupExpiredVerificationRequests, 15 * 60 * 1000); // 15 min

module.exports = {
  findVerificationCode,
  createVerificationCode,
  deleteVerifiedEmail,
  setEmailVerified,
  findVerifiedEmail,
};
