'use strict'

var express = require('express');
var middleware = require('../middleware/middleware');
var articleController = require('../controllers/article');
var testController = require('../controllers/noAuth');
var userController = require('../controllers/user');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/articles' });

// No autentication routes
router.post('/login', testController.login);

// test routes
router.get('/articleTest', articleController.test);
router.get('/userTest', userController.test);

//real routes
router.post('/save-article', middleware.ensureAuthenticated, articleController.save);
router.get('/articles/:last?', middleware.ensureAuthenticated, articleController.getArticles);
router.get('/article/:id', middleware.ensureAuthenticated, articleController.getArticle);
router.put('/article/:id', middleware.ensureAuthenticated, articleController.update);
router.delete('/article/:id', middleware.ensureAuthenticated, articleController.delete);
router.post('/upload-image/:id', middleware.ensureAuthenticated, md_upload, articleController.upload);
router.get('/get-image/:image', middleware.ensureAuthenticated, articleController.getImage);
router.get('/search/:search', middleware.ensureAuthenticated, articleController.search);

router.post('/save-user', middleware.ensureAuthenticated, userController.save);

module.exports = router;