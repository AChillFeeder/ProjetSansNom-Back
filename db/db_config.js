// const { Pool } = require("pg");

// const pool = new Pool({
//   host: "bqjcnth2wjbsrtul4ddr-postgresql.services.clever-cloud.com",
//   user: "ua1workgvspqvscz1zmd",
//   password: "idSSNIIMhqP61WESLukA",
//   database: "bqjcnth2wjbsrtul4ddr",
//   port: 7332,
// });

// pool.connect()
//   .then((client) => {
//     console.log("✅ Connecté à PostgreSQL");
//     client.release();
//   })
//   .catch((err) => {
//     console.error("❌ Erreur de connexion PostgreSQL :", err.stack);
//   });

// module.exports = pool;

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Semaine_campus",
  port: 8889,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise();

db.getConnection()
  .then(() => console.log("✅ Connecté à MySQL sur localhost (Semaine_campus)"))
  .catch(err => console.error("❌ Erreur de connexion MySQL :", err.stack));

module.exports = db;

