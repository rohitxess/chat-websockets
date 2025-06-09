// server side 
const express = require ('express');
const { connection } = require('mongoose');
const app = express()
const path = require('path')
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`server on port ${PORT}`))

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))

let socketsConnected = new Set()

// listen to the event 'connection' on this server
io.on('connection', onConnected ) 

function onConnected(socket){
    (socket) => {console.log(socket.id)}
    socketsConnected.add(socket.id)

    // emit an event when the socket is disconnected

    io.emit('clients-total', socketsConnected.size)

    socket.on('disconnect', () => {
        console.log('Socket is disconnected', socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total', socketsConnected.size)
    })

    socket.on('message', (data) => {
        // send the data to all the clients connected to the ws
        // except to the one who has sent the message 
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    })
}

