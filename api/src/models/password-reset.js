import db from "../db/db.js";

export const storeResetToken = async (email, tokenHash, expiresAt) => {
  try {
    let result = await db.query(
      `UPDATE jobseekers 
       SET password_reset_token_hash = $1, password_reset_expires_at = $2 
       WHERE email = $3 
       RETURNING jobseeker_id`,
      [tokenHash, expiresAt, email]
    );

    if (result.rows.length > 0) {
      return { userType: 'jobseeker', userId: result.rows[0].jobseeker_id };
    }

    result = await db.query(
      `UPDATE societies 
       SET password_reset_token_hash = $1, password_reset_expires_at = $2 
       WHERE email = $3 
       RETURNING society_id`,
      [tokenHash, expiresAt, email]
    );

    if (result.rows.length > 0) {
      return { userType: 'society', userId: result.rows[0].society_id };
    }

    result = await db.query(
      `UPDATE admin_users 
       SET password_reset_token_hash = $1, password_reset_expires_at = $2 
       WHERE email = $3 
       RETURNING admin_id`,
      [tokenHash, expiresAt, email]
    );

    if (result.rows.length > 0) {
      return { userType: 'admin', userId: result.rows[0].admin_id };
    }

    return null;
  } catch (error) {
    console.error('Error storing reset token:', error);
    throw error;
  }
};

export const findUserByResetToken = async (tokenHash) => {
  try {
    let result = await db.query(
      `SELECT jobseeker_id as user_id, email, password_reset_expires_at 
       FROM jobseekers 
       WHERE password_reset_token_hash = $1`,
      [tokenHash]
    );

    if (result.rows.length > 0) {
      return { ...result.rows[0], userType: 'jobseeker' };
    }

    result = await db.query(
      `SELECT society_id as user_id, email, password_reset_expires_at 
       FROM societies 
       WHERE password_reset_token_hash = $1`,
      [tokenHash]
    );

    if (result.rows.length > 0) {
      return { ...result.rows[0], userType: 'society' };
    }

    result = await db.query(
      `SELECT admin_id as user_id, email, password_reset_expires_at 
       FROM admin_users 
       WHERE password_reset_token_hash = $1`,
      [tokenHash]
    );

    if (result.rows.length > 0) {
      return { ...result.rows[0], userType: 'admin' };
    }

    return null;
  } catch (error) {
    console.error('Error finding user by reset token:', error);
    throw error;
  }
};

export const updatePasswordAndClearToken = async (userId, userType, newPasswordHash) => {
  try {
    let tableName, idColumn;

    switch (userType) {
      case 'jobseeker':
        tableName = 'jobseekers';
        idColumn = 'jobseeker_id';
        break;
      case 'society':
        tableName = 'societies';
        idColumn = 'society_id';
        break;
      case 'admin':
        tableName = 'admin_users';
        idColumn = 'admin_id';
        break;
      default:
        throw new Error('Invalid user type');
    }

    const result = await db.query(
      `UPDATE ${tableName} 
       SET password_hash = $1, 
           password_reset_token_hash = NULL, 
           password_reset_expires_at = NULL,
           updated_at = NOW()
       WHERE ${idColumn} = $2 
       RETURNING ${idColumn}`,
      [newPasswordHash, userId]
    );

    return result.rows.length > 0;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export default {
  storeResetToken,
  findUserByResetToken,
  updatePasswordAndClearToken,
};
