const jwt = require('jsonwebtoken');

const ADMIN = {
  usuario: 'admin',
  senha: '123456'
};

exports.login = (req, res) => {
  const { usuario, senha } = req.body;

  if (
    usuario === ADMIN.usuario &&
    senha === ADMIN.senha
  ) {
    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({ token });
  }

  return res.status(401).json({
    mensagem: 'Usuário ou senha inválidos'
  });
};
