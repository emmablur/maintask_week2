var express = require('express');
var router = express.Router();
var Post = require('./../model/post');
var errorHandler = require('./../errorHandler');
var PostController = require('./../controllers/post')

router.get('/', PostController.getPosts);
router.post('/', PostController.createdPosts);
router.delete('/', PostController.deletePosts)
router.delete('/:id', PostController.deletePost)
router.patch('/:id', PostController.updatePost)
module.exports = router;
