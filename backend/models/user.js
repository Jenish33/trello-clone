import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
        required: true,
    },
    boards: [{
        type: mongoose.Schema.Types.ObjectId,
        // explain the above code
        // mongoose.Schema.Types.ObjectId is a mongoose type
        // what is mongoose type?
        // it is a type that mongoose uses to create a unique id
        // so basically, we are saying that boards is an array of unique ids
        // but these unique ids are not just any unique ids
        // they are unique ids that mongoose creates
        // so we are saying that boards is an array of unique ids that mongoose creates
        // but what are these unique ids?
        // these unique ids are the ids of the boards that the user has created
        // so we are saying that boards is an array of ids of the boards that the user has created
        // ObjectId is a mongodb type
        // ref: 'Board' is the name of the model
        ref: 'Board',
    }]
});

const User = mongoose.model('User', userSchema);

export default User;