require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// rota health check
app.get('/health', (req, res) => {
  res.json({ status: 'API OK 🚀' });
});

// rotas
app.use('/auth', require('./routes/auth.routes'));
app.use('/candidatos', require('./routes/candidatos.routes'));
app.use('/votar', require('./routes/votos.routes'));

// IMPORTANTE: remover require('./config/db') aqui

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
