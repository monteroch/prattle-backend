const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');


const graphQlSchema = require('./graphql/schema/index');
const graphQlresolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlresolvers,
    graphiql: true
}));

mongoose.connect('mongodb://localhost:4444/prattle-backend', { useNewUrlParser: true, useUnifiedTopology: true })
.then( () => {
    var server = app.listen(4001, () => {
        console.log('[Prattle-Backend] running on port 4001');
    })
    
    var io = socketIO.listen(server);
    io.on('connect', (socket) => {
        console.log("Connected");
        socket.on('NEW_MESSAGE', (message) => {
            console.log(`[${message.conversationId}]-[${message.author}] ${message.date}: ${message.text}`);
            io.to(message.conversationId).emit('MESSAGE_FROM_SERVER', {
                _id: message._id,
                conversationId: message.conversationId,
                author: message.author,
                date: message.date,
                text: message.text
            });
            // socket.emit("MESSAGE_FROM_SERVER", {message});
        });

        socket.on('LOGGED_IN', (data) => {
            var {user : {conversations} }  = data;
            // console.log("The user is: ", data.user);
            console.log(`[${data.user.fullname}] has logged in`);
            for(var cnt = 0; cnt < conversations.length; cnt++){
                console.log("["+conversations[cnt]._id+"] room joinned");
                socket.join(conversations[cnt]._id);
            }
            //Also create a room with the user _id
            console.log("["+data.user._id+"] room joinned");
        });

        socket.on('JOIN_ROOM_REQUEST', (conversationId) => {
            console.log("The room is: ", conversationId);
            socket.join(conversationId);
        });

    });
})
.catch( error => {
    throw new Error('Cannot connect to DB');
})


app.get('/', (req, res) => {
    res.send('[Prattle-Backend] running on port 4001');
});