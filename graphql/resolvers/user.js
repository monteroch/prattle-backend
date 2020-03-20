const User  = require('../../models/user');
const Conversation = require('../../models/conversation');
const bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;   


module.exports = {
    createUser: async args => {
        try{
            //Checking if the email already exists in the database
            const existingUser = await User.findOne({email: args.userInput.email})
            if(existingUser){
                throw new Error('User exist already');
            }
            //Creating the user
            const user = new User({
                _id: args.userInput._id,
                fullname: args.userInput.fullname,
                email: args.userInput.email,
                contacts: [],
                requests:[],
                pendingRequests:[]
            });
            //Saving the user into the database
            const result = await user.save();
            return {
                ...result._doc,
                _id: result.id
            };
        }catch(error){
            throw error;
        }
    },
    users: async () => {
        try{    
            const users = await User.find();
            return users.map( user => {
                return user
            });
        }catch(error){
            throw error;
        }
    },
    loadProfile: async(userId) => {
        try{    
            let user = await User.findOne({_id: userId.userId}).populate('contacts').populate('conversations');
            return user;
        }catch(error){
            throw error;
        }
    },
    retrieveUsers: async(pattern) => {
        try{    
            const users = await User.find(
                {"fullname": {$regex: pattern.pattern, "$options": "i"}},
            );
            if(users.length > 0){
                return users.map( user => {
                    return user
                });
            }else{
                return {};
            }
        }catch(error){
            throw error;
        }
    },
    addContact: async(request) => {
        let requestId = mongoose.Types.ObjectId().valueOf();
        let sourceId = request.RequestInput.sourceId;
        let sourceName = request.RequestInput.sourceName;
        let targetId = request.RequestInput.targetId; 
        let targetName = request.RequestInput.targetName;
        try{
            let sourceRequest = await User.updateOne(
                { _id: sourceId }, 
                { $push: { pendingRequests: {requestId, sourceId, sourceName, targetId, targetName} } },
            );
            if(sourceRequest){
                let targetRequest = await User.updateOne(
                    { _id: targetId }, 
                    { $push: { requests: {requestId, sourceId, sourceName, targetId, targetName} } },
                );
                if(targetRequest){
                    const user = await User.findById(sourceId);
                    if (user) return user;
                    else throw new Error("Cant send conatct request");
                }
                else
                    throw new Error("Cant send conatct request");
            }else{
                throw new Error("Cant send conatct request");
            }
        }catch(error){
            throw new Error("Cant send conatct request");
        }
    },
    handleFriendshipRequest: async(request) => {
        let value = request.HandleRequest.value;
        let requestId = request.HandleRequest.requestId;
        let sourceId = request.HandleRequest.sourceId;
        let sourceName = request.HandleRequest.sourceName;
        let targetId = request.HandleRequest.targetId;
        let targetName = request.HandleRequest.targetName;
        try{
             //Remove request from 2 users
             let removeReqFromSource = await User.updateOne(
                { _id: sourceId }, 
                { $pull: { pendingRequests: {requestId: requestId} } },
            );
            let removeReqFromTarget = await User.updateOne(
                { _id: targetId }, 
                { $pull: { requests: {requestId: requestId} } },
            );
            if(value){
                //Create new conversation Id
                let conversationId = ObjectId().toString();
                //Add contact to 2 users
                let addToSource = await User.updateOne(
                    { _id: sourceId }, 
                    { $push: { contacts: targetId } },
                );
                let addConversationToSource = await User.updateOne(
                    { _id: sourceId }, 
                    { $push: { conversations: conversationId } },
                )
                let addToTarget = await User.updateOne(
                    { _id: targetId }, 
                    { $push: { contacts: sourceId } },
                );
                let addConversationToTarget = await User.updateOne(
                    { _id: targetId }, 
                    { $push: { conversations: conversationId } },
                )
                //Creating the conversation Object
                const conversation = new Conversation({
                    _id: conversationId,
                    name: "noname",
                    participants: [{
                        _id: sourceId,
                        name: sourceName,
                        addedAt: new Date(Date.now()).toLocaleString()
                    }, {
                        _id: targetId,
                        name: targetName,
                        addedAt: new Date(Date.now()).toLocaleString()
                    }],
                    createdAt: new Date(Date.now()).toLocaleString(),
                    lastMessageAt: new Date(Date.now()).toLocaleString()
                });
                return conversation.save()
                .then( conversation => {
                    return conversation;
                })
                .catch(error => {return error})
            }
        }catch(error){
            return error;
        }
    },
    createGroup: async(data) => {
        console.log("data inside CREATE GROUP: ", data);
        try{
            participants = data.UsernameInput.map( user => {
                return {
                    _id: user._id,
                    name: user.name,
                    addedAt: user.addedAt
                }
            });
            //Create conversationId
            let conversationId = ObjectId().toString();
            //Add conversation tu users
            participants.forEach( async participant => {
                await User.updateOne(
                    { _id: participant._id }, 
                    { $push: { conversations: conversationId } },
                )
            });
            //Creating the conversation Object
            const conversation = new Conversation({
                _id: conversationId,
                name: data.GroupName,
                participants: [...participants],
                createdAt: new Date(Date.now()).toLocaleString(),
                lastMessageAt: new Date(Date.now()).toLocaleString()
            });
            return conversation.save()
            .then( conversation => {
                return conversation;
            })
            .catch(error => {return error})
        }catch(error){
            return error;
        }
    },
    getConversations: async(data) => {
        try{
            let user = await User.findOne({_id: data.userId}).populate('contacts').populate('conversations');
            return user.conversations;
        }catch(error){
            throw error;
        }
    }
};