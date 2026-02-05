const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log("✅ Conectado ao Postgres"))
  .catch(err => console.error("❌ Erro ao conectar no Postgres:", err));

module.exports = pool;
