const { Pool } = require("pg");

const pool = new Pool({
  host: "bqjcnth2wjbsrtul4ddr-postgresql.services.clever-cloud.com",
  user: "ua1workgvspqvscz1zmd",
  password: "idSSNIIMhqP61WESLukA",
  database: "bqjcnth2wjbsrtul4ddr",
  port: 7332,
});

pool.connect()
  .then((client) => {
    console.log("✅ Connecté à PostgreSQL");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion PostgreSQL :", err.stack);
  });

module.exports = pool;