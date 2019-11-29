const express = require('express');
const cors = require('cors');

const errorNotFound = { error: 'id.not_found' };

let nextId = 1;
let posts = [];


const server = express();
server.use(express.json());
server.use(cors());

function findPostIndexById(id) {
    return posts.findIndex(o => o.id === id);
}

server.get('/posts/seenPosts/:lastSeenId', (req, res) => {
    const lastSeenId = Number(req.params.lastSeenId);
    const index = findPostIndexById(lastSeenId);
    // console.log(index);
    let lastPosts;
    if (lastSeenId === 0) {
        lastPosts = posts.slice(posts.length - 5);

    } else if (lastSeenId > 0 && lastSeenId <= 5) {
        lastPosts = posts.slice(0, index);

    } else {
        lastPosts = posts.slice(index - 5, index);
    }
    
    // console.log(lastPosts)
    res.send(lastPosts);
});


server.get('/posts/:seenId/:firstSeenId', (req, res) => {
    const firstSeenId = Number(req.params.firstSeenId);
    const seenId = Number(req.params.seenId);
    console.log(firstSeenId);
    console.log(seenId);
    if (firstSeenId > seenId) {
        res.send(posts.slice(posts.indexOf(posts)));
        return;
    }

    const index = posts.findIndex(o => o.id > firstSeenId);
    if (index === -1) {
        res.send([]);
        return;
    }

    res.send(posts.slice(index));
});

server.get('/posts', (req, res) => {
    res.send(posts);
});

server.post('/posts', (req, res) => {
    const body = req.body;
    const id = body.id;
    if (id === 0) {
        posts = [...posts, { id: nextId++, content: body.content, type: body.type, likes: 0 }];
        res.send(posts);
        return;
    }
    const index = findPostIndexById(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
    posts = posts.map(o => o.id !== id ? o : { ...o, content: body.content, type: body.type });
    res.send(posts);
});

server.delete('/posts/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = findPostIndexById(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
    posts = posts.filter(o => o.id != id);
    res.send(posts);
});


server.post('/posts/:id/likes', (req, res) => { 
    const id = Number(req.params.id);
    const index = findPostIndexById(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
    posts = posts.map(o => o.id !== id ? o : { ...o, likes: o.likes + 1 })
    res.send(posts);
});

server.delete('/posts/:id/likes', (req, res) => { 
    const id = Number(req.params.id);
    const index = findPostIndexById(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
    posts = posts.map(o => o.id !== id ? o : { ...o, likes: o.likes - 1 })
    res.send(posts[index]);//(`${posts[index].likes}`)
});

server.listen(process.env.PORT || 9999);


