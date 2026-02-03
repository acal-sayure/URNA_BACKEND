const sql = require('../config/db');



exports.create = async (req, res) => {
  try {
    const { nome, funcao, numero_votacao } = req.body;
      const exists = await sql.query`
        SELECT 1 FROM CANDIDATOS WHERE NUM_VOTACAO = ${numero_votacao}
      `;

      if (exists.recordset.length > 0) {
        return res.status(400).json({
          erro: "Número de votação já cadastrado"
        });
      }

    if (!nome || !funcao || !numero_votacao) {
      return res.status(400).json({ erro: "Campos obrigatórios não informados" });
    }

    const foto = req.file ? req.file.filename : null;

    await sql.query`
      INSERT INTO CANDIDATOS (NOME, FUNCAO, NUM_VOTACAO, FOTO, ATIVO)
      VALUES (${nome}, ${funcao}, ${numero_votacao}, ${foto}, 1)
    `;

    res.status(201).json({
      message: "Candidato cadastrado com sucesso",
      foto
    });

  } catch (error) {
  console.error(error);

  if (error.number === 2627 || error.number === 2601) {
    return res.status(400).json({
      erro: "Número de votação já cadastrado"
    });
  }

  res.status(500).json({ erro: "Erro ao cadastrar candidato" });
}
};



exports.list = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT ID, NOME, FUNCAO, FOTO FROM CANDIDATOS WHERE ATIVO = 1
    `;
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
};


exports.listPublic = async (req, res) => {
  const result = await sql.query`
    SELECT ID, NOME, FUNCAO, FOTO
    FROM CANDIDATOS
    WHERE ATIVO = 1
  `;
  res.json(result.recordset);
};
