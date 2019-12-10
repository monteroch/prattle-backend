const User  = require('../../models/user');
const bcrypt = require('bcryptjs');

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
        console.log("The pattern is: ", pattern);
        try{    
            const users = await User.find(
                {"firstname": {$regex: pattern.pattern, "$options": "i"}},
            );
            if(users.length > 0){
                console.log("The result of users is: ", users);
                return users.map( user => {
                    return user
                });
            }else{
                return {};
            }
        }catch(error){
            throw error;
        }
    }
};