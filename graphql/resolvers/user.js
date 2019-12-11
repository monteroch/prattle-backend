const User  = require('../../models/user');
const bcrypt = require('bcryptjs');
var mongoose = require('mongoose');

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
                firstname: args.userInput.firstname,
                lastname: args.userInput.lastname, 
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
            console.log("Inside loadProfile");
            console.log("userID: ", userId)
            const user = await User.findById(userId.userId);
            console.log("The user is: ", user);
            return user;
        }catch(error){
            throw error;
        }
    },
    retrieveUsers: async(pattern) => {
        // console.log("The pattern is: ", pattern);
        try{    
            const users = await User.find(
                {"firstname": {$regex: pattern.pattern, "$options": "i"}},
            );
            if(users.length > 0){
                // console.log("The result of users is: ", users);
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
        console.log("Inside addContact");
        console.log("The request is: ", request.RequestInput);
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
            console.log("sourceRequest: ", sourceRequest);
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
        console.log("Inside handleFriendshipRequest");
        // console.log("The request is: ", request.RequestInput);
        console.log("The request is: ", request);
        let value = request.HandleRequest.value;
        let requestId = request.HandleRequest.requestId;
        let sourceId = request.HandleRequest.sourceId;
        let targetId = request.HandleRequest.targetId;
        console.log("Value: ", value);
        console.log("RequestID: ", requestId);
        console.log("SourceID: ", sourceId);
        console.log("TargetID: ", targetId);
        try{
             //Remove request from 2 users
             let removeReqFromSource = await User.updateOne(
                { _id: sourceId }, 
                { $pull: { pendingRequests: {requestId: requestId} } },
            );
            console.log("removeReqFromSource: ", removeReqFromSource);
            let removeReqFromTarget = await User.updateOne(
                { _id: targetId }, 
                { $pull: { requests: {requestId: requestId} } },
            );
            console.log("removeReqFromTarget: ", removeReqFromTarget);
            if(value){
                //Add contact to 2 users
                let addToSource = await User.updateOne(
                    { _id: sourceId }, 
                    { $push: { contacts: targetId } },
                );
                console.log("addToSource: ", addToSource);
                let addToTarget = await User.updateOne(
                    { _id: targetId }, 
                    { $push: { contacts: sourceId } },
                );
                console.log("addToTarget: ", addToTarget);
            }
            const user = await User.findById(targetId);
            if (user) return user;
            else throw new Error("Error handling the friendship request");
        }catch(error){
            throw new Error("Error handling the friendship request.")
        }
    }
};