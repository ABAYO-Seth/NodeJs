const express = require('express');
const bodyParser = require('body-parser');
const { Socket } = require('engine.io');
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const messages = [
    {
        name: "Tim",
        message: "Hi"
    },
    {
        name: "Jane",
        message: "Hello"
    }
]
app.get('/messages', (req, res) => {
    res.send(messages)
});

app.post('/messages', (req, res) => {
    messages.push(req.body)
    io.emit('message',req.body)
    res.sendStatus(200)
});

io.on('connection', (Socket)=>{
    console.log('a user connected');
})
const server = http.listen(4000, () => {
    console.log("Server is listening on port ", server.address().port);
});
