const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const conversationSchema = new Schema({
    _id:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    participants:[{
        _id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: false
        },
        addedAt: {
            type: String,
            required: false
        }
    }],
    createdAt:{
        type: String
    },
    lastMessageAt:{
        type: String
    }

});


const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports =  Conversation;
