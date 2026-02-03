const sql = require('../config/db');

exports.votar = async (req, res) => {
  try {
    const { id_candidato } = req.body;

    if (!id_candidato) {
      return res.status(400).json({
        erro: "Candidato não informado"
      });
    }

    // verifica se candidato existe e está ativo
    const candidato = await sql.query`
      SELECT ID FROM CANDIDATOS
      WHERE ID = ${id_candidato} AND ATIVO = 1
    `;

    if (candidato.recordset.length === 0) {
      return res.status(404).json({
        erro: "Candidato inválido"
      });
    }

    // registra o voto
    await sql.query`
      INSERT INTO VOTOS (CANDIDATO_ID, STATUS)
      VALUES (${id_candidato}, 'VALIDO')
    `;

    res.status(201).json({
      message: "Voto computado com sucesso 🗳️"
    });

  } catch (error) {
    console.error("ERRO AO VOTAR:", error);
    res.status(500).json({
      erro: "Erro ao registrar voto"
    });
  }
};

exports.apuracao = async (req, res) => {
  const result = await sql.query`
    SELECT 
      C.ID,
      C.NOME,
      COUNT(V.ID) AS TOTAL_VOTOS
    FROM CANDIDATOS C
    LEFT JOIN VOTOS V ON V.CANDIDATO_ID = C.ID
    WHERE C.ATIVO = 1
    GROUP BY C.ID, C.NOME
    ORDER BY TOTAL_VOTOS DESC
  `;

  res.json(result.recordset);
};

