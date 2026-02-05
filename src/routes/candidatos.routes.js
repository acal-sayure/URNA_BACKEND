const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/candidatos.controller');
const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// configuração do upload
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "urna_sipa",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});


const upload = multer({ storage });

router.post('/', auth, upload.single('foto'), controller.create);


// admin (com token)
router.get('/admin', auth, controller.list);

// votação (sem token)
router.get('/public', controller.listPublic);



module.exports = router;
