const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    _id:{
        type: String,
        required: true
    },
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contacts:[String],
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
});

module.exports = mongoose.model('User', userSchema);