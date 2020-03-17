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
    
    //change from date to createdAt
    var io = socketIO.listen(server);
    io.on('connect', (socket) => {
        socket.on('NEW_MESSAGE', (message) => {
            if(message.type){
                switch(message.type){
                    case "FRIENDSHIP_REQUEST":
                        io.to(message.source).emit('UPDATE_REQUESTS', {_id: message.source});
                        io.to(message.target).emit('FRIENDSHIP_REQUEST_NOTIFICATION', {
                            type: message.type,
                            author: message.author,
                            text: message.text,
                            _id: message.target
                        });
                        break;
                    case "HANDLE_FRIENDSHIP_REQUEST":
                        if( message.value === true){
                            io.to(message.source).emit('FRIENDSHIP_REQUEST_ACCEPTED', {
                                type: message.type,
                                author: message.source,
                                text: message.text,
                                _id: message.source
                            });
                            io.to(message.target).emit('UPDATE_REQUESTS_AND_JOIN_ROOM', {_id: message.target});
                        }else{
                            io.to(message.source).emit('UPDATE_REQUESTS', {_id: message.source});
                            io.to(message.target).emit('UPDATE_REQUESTS', {_id: message.target});
                        }
                        break;
                    case "JOIN_ROOM_REQUEST":
                        let users = message.conversation.participants.map( user => user._id );
                        for(var cont = 0; cont < users.length; cont++){
                            io.to(users[cont]).emit('JOIN_ROOM_REQUEST', {id: message.conversation._id});
                        }
                        break;
                    case "JOIN_ROOM":
                        socket.leave(message.id);
                        socket.join(message.id);
                        break;
                    default:
                        break;
                }
            }else{
                io.to(message.conversationId).emit('MESSAGE_FROM_SERVER', {
                    _id: message._id,
                    conversationId: message.conversationId,
                    author: message.author,
                    createdAt: message.date, 
                    text: message.text
                });
            }
            // socket.emit("MESSAGE_FROM_SERVER", {message});
        });

        socket.on('LOGGED_IN', (data) => {
            var {user : {conversations, contacts} }  = data;
            console.log(`[${data.user.fullname}] has logged in`);
            //Join conversations
            for(var cnt = 0; cnt < conversations.length; cnt++){
                socket.leave(conversations[cnt]._id);
                socket.join(conversations[cnt]._id);
            }
            //Join contacts
            for(var cnt = 0; cnt < contacts.length; cnt++){
                socket.leave(contacts[cnt]._id);
                socket.join(contacts[cnt]._id);
            }
            socket.leave(data.user._id);
            socket.join(data.user._id);
            io.to(data.user._id).emit('LOGGED_IN', {
                type: "LOGGED_IN",
                author: data.user.fullname,
                text: `${data.user.fullname} logged in`
            });
            //Also create a room with the user _id
            console.log("["+data.user._id+"] room joinned");
        });

        socket.on('JOIN_ROOM_REQUEST', (conversationId) => {
            socket.leave(conversationId);
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