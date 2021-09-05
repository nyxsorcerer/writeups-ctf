const sqlite = require("sqlite-async");

class Database {
  constructor(db_file) {
    this.db_file = db_file;
    this.db = undefined;
  }

  async connect() {
    this.db = await sqlite.open(this.db_file);
  }
  async migrate() {
    return this.db.exec(`            
            DROP TABLE IF EXISTS commissions;
            
            CREATE TABLE IF NOT EXISTS commissions (
                id            VARCHAR(255) NOT NULL PRIMARY KEY,
                subject       VARCHAR(255) NOT NULL,
                content       VARCHAR(255) NOT NULL,
                cspViolations INT(1) NOT NULL,
                completed     INT(1) NOT NULL,
                created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
            );
        `);
  }

  async getCommissionID(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let stmt = await this.db.get(
          "SELECT subject, content FROM commissions WHERE id = ?",
          [id]
        );
        resolve(await stmt);
      } catch (e) {
        reject(e);
      }
    });
  }

  async addCommission(details) {
    return new Promise(async (resolve, reject) => {
      try {
        let stmt = await this.db.prepare(
          "INSERT INTO commissions (id, subject, content, cspViolations, completed) VALUES ($id, $subject, $content, $cspViolations, $completed)"
        );        
        resolve(await stmt.run(details));
      } catch (e) {
        reject(e);
      }
    });
  }

  async updateComission(details) {
    return new Promise(async (resolve, reject) => {
      try {
        let stmt = await this.db.prepare(
          `UPDATE commissions SET cspViolations = $cspViolations, completed = $completed WHERE id = $id`
        );
        resolve(await stmt.run(details));
      } catch (e) {
        reject(e);
      }
    });
  }
  
}

module.exports = Database;