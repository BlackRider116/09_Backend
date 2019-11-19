const express = require('express');
const cors = require('cors');

const server = express();
server.use(express.json());
server.use(cors());

const messages = [];
let nextId = 1;

server.get('/messages/:lastSeenId', (req, res) => {
    const lastSeenId = Number(req.params.lastSeenId);
    // lastSeend === 0
    if (lastSeenId === 0) {
        res.send(messages.slice(messages.length - 50));
        return;
    }

    const index = messages.findIndex(o => o.id > lastSeenId);
    if (index === -1) {
        // Bad Request
        res.send([]);
        return;
    }

    res.send(messages.slice(index, index + 50));
});

server.post('/messages', (req, res) => {
    const {content} = req.body;
    // const content = req.body.content;

    // no content
    setTimeout(() => {
        messages.push({
            id: nextId++,
            content
        });

        res.status(204).end();
    }, 5000);

});

server.listen(9999);