const express = require('express');
const router = express.Router();
const AdController = require('../controllers/ads.controller');
const authMiddleware = require("../utils/authMiddleware");
const imageUpload = require('../utils/imageUpload');

router.get('/ads', AdController.getAll);
router.get('/ads/:id', AdController.getId);
router.post('/ads', authMiddleware, imageUpload.single('image'), AdController.post);
router.put('/ads/:id', authMiddleware, imageUpload.single('image'), AdController.put);
router.delete('/ads/:id', authMiddleware, AdController.delete);
router.get('/ads/search/:searchPhrase', AdController.searchPhrase);

module.exports = router;