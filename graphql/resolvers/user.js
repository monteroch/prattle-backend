const User  = require('../../models/user');

module.exports = {
    createUser: async args => {
        try{
            //Checking if the email already exists in the database
            const existingUser = await User.findOne({email: args.userInput.email})
            if(existingUser){
                throw new Error('User exist already');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            //Creating the user
            const user = new User({
                firstname: args.userInput.firstname,
                lastname: args.userInput.lastname, 
                email: args.userInput.email,
                password: hashedPassword
            });
            //Saving the user into the database
            const result = await user.save();
            return {
                ...result._doc,
                password: null,
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
    }
};