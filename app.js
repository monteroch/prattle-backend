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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlresolvers,
    graphiql: true
}));

mongoose.connect('mongodb://localhost:4444/prattle-backend')
.then( () => {
    var server = app.listen(4001, () => {
        console.log('Prattle running on port 4001');
    })
    
    var io = socketIO.listen(server);
    io.on('connect', (socket) => {

        console.log("New user connected");

        socket.on('newMessage', (message) => {
            console.log("The message is: ", message);
        });

    });
})
.catch( error => {
    throw new Error('Cannot connect to DB');
})


app.get('/', (req, res) => {
    res.send('Que pedo prrillo, esta es la app buena');
});