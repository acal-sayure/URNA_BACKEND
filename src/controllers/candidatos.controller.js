const db = require('../config/db');

exports.create = async (req, res) => {
  try {
    const { nome, funcao, numero } = req.body;

    if (!nome || !funcao || !numero) {
      return res.status(400).json({
        erro: "Campos obrigatórios não informados"
      });
    }

    // verifica duplicidade
    const exists = await db.query(
      `SELECT 1 FROM candidatos WHERE numero = $1`,
      [numero]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({
        erro: "Número de votação já cadastrado"
      });
    }

    const foto = req.file ? req.file.filename : null;

    await db.query(
      `INSERT INTO candidatos (nome, funcao, num_votacao, foto)
       VALUES ($1, $2, $3, $4)`,
      [nome, funcao, numero, foto]
    );

    res.status(201).json({
      message: "Candidato cadastrado com sucesso",
      foto
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: "Erro ao cadastrar candidato"
    });
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
