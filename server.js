const http = require('http');
const headers = require('./headers');
const errorHandler = require('./errorHandler');
const mongoose = require('mongoose');
const Post = require('./model/post')
const dotenv = require('dotenv');

dotenv.config({path: './config.env'})

const DB = process.env.DATABASE
.replace('<username>', process.env.DATABASE_ACCOUNT)
.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose
    .connect(DB)
    .then(() => console.log('資料庫連接成功'));

const requestListener = async (req, res) => {
    let body = ''   
    req.on('data', chunk => {
        body += chunk
    })

    if (req.url === '/posts' && req.method === 'GET') {
        res.writeHead('200', headers);
        const posts = await Post.find();
        res.write(JSON.stringify({
            status: 'success',
            posts
        }))
        res.end();
    } else if (req.url === '/posts' && req.method === 'POST') {
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const newPost = await Post.create({
                    name: data.name,
                    content: data.content,
                })
                res.writeHead('200', headers)
                res.write(JSON.stringify({
                    "status": "success",
                    "data": newPost
                }))
                res.end();
            } catch (error) {
                errorHandler(res, headers, error)
            }
        })
    } else if (req.url === '/posts' && req.method === 'DELETE') {
        await Post.deleteMany({});
        res.writeHead('200', headers);
        res.write(JSON.stringify({
            "status": "success",
            "posts": await Post.find({})
        }))
        res.end();
    } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
        try {
            const id = req.url.split('/').pop();
            await Post.findByIdAndDelete(id); // 刪除單筆
            res.writeHead('200', headers);
            res.write(JSON.stringify({
                "status": "success",
                "data": null
            }));
            res.end();

        } catch (error) {
            errorHandler(res, headers, error)
        }

    } else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
        req.on('end', async () => {
            try {
                const editContent = JSON.parse(body)
                if (editContent !== undefined) {
                    const id = req.url.split('/').pop();
                    await Post.findByIdAndUpdate({_id: id}, editContent) // 更新單筆
                    res.writeHead('200', headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": await Post.find({_id: id})
                    }));
                    res.end();
                } else {
                    errorHandler(res, headers)
                }
            } catch (error) {
                errorHandler(res, headers, error)
            }
        })

    } else {
        res.writeHead('404', headers);
        res.write(JSON.stringify({
            status: 'fail',
            message: '無此路由'
        }))
        res.end();
    }
}
const server = http.createServer(requestListener);
server.listen(process.env.PORT);