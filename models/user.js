const mongoose = require('mongoose');
const Conversation  = require('./conversation');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    _id:{
        type: String,
        required: true
    },
    fullname:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contacts:[{
        type: Schema.Types.String,
        ref: 'User'
    }],
    requests:[{
        requestId: String,
        sourceId: String,
        sourceName: String,
        targetId: String,
        targetName: String
    }],
    pendingRequests:[{
        requestId: String,
        sourceId: String,
        sourceName: String,
        targetId: String,
        targetName: String
    }],
    conversations:[{
        type: Schema.Types.String,
        ref: 'Conversation'
    }]
});


const User = mongoose.model('User', userSchema);
module.exports =  User;
