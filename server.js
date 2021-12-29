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

mongoose.Promise = Promise
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
    Message.find({}, (err, messages) => {
        res.send(messages)
    })

});

app.post('/messages', async (req, res) => {
    const message = new Message(req.body);

    const saveMessage = await message.save()


    // messages.push(req.body)
    console.log('saved');
    const censored = await Message.findOne({ message: 'badword' })


    if (censored)
        await Message.deleteOne({ _id: censored.id })
    else
        io.emit('message', req.body)
    res.sendStatus(200)

    // .catch((err) => {
    //     res.sendStatus(500);
    //     return console.error(err);
    // })


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
