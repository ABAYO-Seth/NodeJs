const express = require('express');
const bodyParser = require('body-parser');
const { Socket } = require('engine.io');
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose');
const { stringify } = require('querystring');


app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const dburl = 'mongodb+srv://user:user@cluster0.fz28x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const Message = mongoose.model('Message', {
    name: String,
    message: String
})

// const messages = [
//     {
//         name: "Tim",
//         message: "Hi"
//     },
//     {
//         name: "Jane",
//         message: "Hello"
//     }
// ]
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages)=>{
        res.send(messages)
    })
   
});

app.post('/messages', (req, res) => {
    const message = new Message(req.body);

    message.save((err) => {
        if (err)
            sendStatus(500)
        // messages.push(req.body)
        io.emit('message', req.body)
        res.sendStatus(200)
    })

});

io.on('connection', (Socket) => {
    console.log('a user connected');
})

mongoose.connect(dburl, (err) => {
    console.log('mongo db connection', err);
});

const server = http.listen(4000, () => {
    console.log("Server is listening on port ", server.address().port);
});
