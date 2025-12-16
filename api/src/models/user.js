import db from "../db/db.js";

class User {
  constructor(userData) {
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
    this.username = userData.username;
    this.dob = userData.dob;
    this.email = userData.email;
    this.password = userData.password;
  }

  static async findOne(query) {
    try {
      const { email } = query;
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async deleteMany(query = {}) {
    try {
      if (Object.keys(query).length === 0) {
        await db.query('DELETE FROM users');
      } else {
        // Handle specific query conditions if needed
        const { email } = query;
        if (email) {
          await db.query('DELETE FROM users WHERE email = $1', [email]);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async save() {
    try {
      const result = await db.query(
        'INSERT INTO users (first_name, last_name, username, dob, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [this.first_name, this.last_name, this.username, this.dob, this.email, this.password]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

export default User;
