import db from '../../db/db.js';

/**
 * Test transaction manager for rollback-based testing
 * Ensures tests don't permanently alter the database
 */
class TestTransaction {
  constructor() {
    this.client = null;
  }

  /**
   * Begin a new transaction for a test
   * Call this in beforeEach
   */
  async begin() {
    this.client = await db.connect();
    await this.client.query('BEGIN');
    return this.client;
  }

  /**
   * Rollback the transaction after a test
   * Call this in afterEach
   */
  async rollback() {
    if (this.client) {
      try {
        await this.client.query('ROLLBACK');
        this.client.release();
      } catch (err) {
        console.error('Rollback error:', err);
        this.client.release();
      }
      this.client = null;
    }
  }

  /**
   * Get the current transaction client
   * Use this for queries within tests
   */
  getClient() {
    return this.client;
  }

  /**
   * Execute a query within the transaction
   */
  async query(text, params) {
    if (!this.client) {
      throw new Error('Transaction not started. Call begin() first.');
    }
    return this.client.query(text, params);
  }
}

export default TestTransaction;
