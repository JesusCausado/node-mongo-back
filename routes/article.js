'use strict'

var express = require('express');
var articleController = require('../controllers/article');
var testController = require('../controllers/user');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/articles' });

// test routes
router.get('/articleTest', articleController.test);
router.post('/datos-curso', articleController.datosCurso);

//article routes
router.post('/save', articleController.save);
router.get('/articles/:last?', articleController.getArticles);
router.get('/article/:id', articleController.getArticle);
router.put('/article/:id', articleController.update);
router.delete('/article/:id', articleController.delete);
router.post('/upload-image/:id', md_upload, articleController.upload);
router.get('/get-image/:image', articleController.getImage);
router.get('/search/:search', articleController.search);

//test routes
router.get('/userTest', testController.test);


module.exports = router;