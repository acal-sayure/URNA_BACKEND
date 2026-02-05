const db = require('../config/db');

exports.create = async (req, res) => {
  try {
    const { nome, funcao, num_votacao } = req.body;

    // const fotoUrl = req.file ? req.file.path : null;
    const fotoUrl = null;


    await db.query(
      `INSERT INTO candidatos (nome, funcao, foto, num_votacao, ativo)
       VALUES ($1, $2, $3, $4, true)`,
      [nome, funcao, fotoUrl, num_votacao]
    );

    res.status(201).json({ message: "Candidato cadastrado" });

  } catch (error) {
    console.error("ERRO CREATE:", error);
console.error("ERRO DETALHADO:", error.message);
console.error("STACK:", error.stack);

    res.status(500).json({ erro: "Erro ao cadastrar candidato" });
  }
};


exports.list = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, nome, funcao, foto, num_votacao
       FROM candidatos
       WHERE ativo = true
       ORDER BY num_votacao`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
};

exports.listPublic = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, nome, funcao, foto, num_votacao
       FROM candidatos
       WHERE ativo = true
       ORDER BY num_votacao`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
};
