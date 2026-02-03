const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/candidatos.controller');
const multer = require('multer');
const path = require('path');

// configuração do upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nome = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${nome}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagem inválido'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter
});

router.post('/', auth, upload.single('foto'), controller.create);


// admin (com token)
router.get('/admin', auth, controller.list);

// votação (sem token)
router.get('/public', controller.listPublic);



module.exports = router;
