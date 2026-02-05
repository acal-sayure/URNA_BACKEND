const db = require('../config/db');

exports.votar = async (req, res) => {
  try {
    const { id_candidato } = req.body;

    if (!id_candidato) {
      return res.status(400).json({ erro: "Candidato não informado" });
    }

    // 🔒 verifica se urna está liberada
    const statusUrna = await sql.query(`
      SELECT liberada FROM controle_urna LIMIT 1
    `);

    if (!statusUrna.rows[0].liberada) {
      return res.status(403).json({
        erro: "Urna bloqueada. Aguarde o mesário."
      });
    }

    // verifica candidato
    const candidato = await sql.query(`
      SELECT id FROM candidatos
      WHERE id = $1 AND ativo = true
    `, [id_candidato]);

    if (candidato.rows.length === 0) {
      return res.status(404).json({ erro: "Candidato inválido" });
    }

    // registra voto
    await sql.query(`
      INSERT INTO votos (candidato_id, status)
      VALUES ($1, 'VALIDO')
    `, [id_candidato]);

    // 🔒 BLOQUEIA URNA
    await sql.query(`
      UPDATE controle_urna SET liberada = false
    `);

    res.status(201).json({
      message: "Voto computado com sucesso"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao registrar voto" });
  }
};


exports.apuracao = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
          c.id,
          c.nome,
          COUNT(v.id) AS total_votos
       FROM candidatos c
       LEFT JOIN votos v ON v.candidato_id = c.id
       WHERE c.ativo = true
       GROUP BY c.id
       ORDER BY total_votos DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
};

exports.statusUrna = async (req, res) => {
  const result = await sql.query(`
    SELECT liberada FROM controle_urna LIMIT 1
  `);

  res.json(result.rows[0]);
};

exports.liberarUrna = async (req, res) => {
  await sql.query(`
    UPDATE controle_urna SET liberada = true
  `);

  res.json({ message: "Urna liberada" });
};
