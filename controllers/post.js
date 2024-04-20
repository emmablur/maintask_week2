var Post = require('./../model/post');
var errorHandler = require('./../errorHandler');

const posts = {
    async getPosts(req, res) {
        const posts = await Post.find();
        res.status(200).json({
            status: 'success',
            posts
        })
    },
    async createdPosts(req, res) {
        try {
            const newPost = await Post.create(req.body);
            res.status(200).json({
                status: 'success',
                posts: newPost
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    async deletePost(req, res) {
        try {
            const { id } = req.params;
            await Post.findByIdAndDelete(id); // 刪除單筆
            res.send({
                "status": "success",
                "data": null
            })
        } catch (error) {
            errorHandler(res, error)
        }

    },
    async deletePosts(req, res) {
        await Post.deleteMany({});
        res.send({
            "status": "success",
            "posts": await Post.find({})
        })
    },
    async updatePost(req, res) {
        try {
            const editContent = req.body;
            if (editContent !== undefined) {
                const { id } = req.params;
                await Post.findByIdAndUpdate({ _id: id }, editContent) // 更新單筆
                res.send({
                    "status": "success",
                    "data": await Post.find({ _id: id })
                })
            } else {
                errorHandler(res, headers)
            }
        } catch (error) {
            errorHandler(res, headers, error)
        }
    }
}
module.exports = posts;