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
        sourceId: String,
        targetId: String
    }],
    pendingRequests:[{
        sourceId: String,
        targetId: String
    }],
});

module.exports = mongoose.model('User', userSchema);