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

server.get('/posts/:lastSeenId', (req, res) => {
    const lastSeenId = Number(req.params.lastSeenId);
    console.log(lastSeenId);
    if (lastSeenId === 0) {
        res.send(posts.slice(posts.indexOf(posts[posts.length - 5])));
        return;
    }

    const index = posts.findIndex(o => o.id > lastSeenId);
    if (index === -1) {
        res.send([]);
        return;
    }

    res.send(posts.slice(index, index + 5));
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

server.post('/posts/:id/likes', (req, res) => { //god
    const id = Number(req.params.id);
    const index = findPostIndexById(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
    posts = posts.map(o => o.id !== id ? o : { ...o, likes: o.likes + 1 })
    res.send(posts);
});

server.delete('/posts/:id/likes', (req, res) => { // god
    const id = Number(req.params.id);
    const index = findPostIndexById(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
    posts = posts.map(o => o.id !== id ? o : { ...o, likes: o.likes - 1 })
    res.send(posts);
});

server.listen(process.env.PORT || 9999);


