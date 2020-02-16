const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const conversationSchema = new Schema({
    _id:{
        type: String,
        required: true
    },
    participants:[{
        type: Schema.Types.String,
        ref: 'User'
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
