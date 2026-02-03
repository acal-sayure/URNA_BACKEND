require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// teste rápido
app.get('/health', (req, res) => {
  res.json({ status: 'API OK 🚀' });
});

app.use('/auth', require('./routes/auth.routes'));
app.use('/candidatos', require('./routes/candidatos.routes'));
app.use('/votar', require('./routes/votos.routes'));




// conecta no banco
require('./config/db');

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
