const mongoose = require('mongoose');

var register = mongoose.Schema({
    email: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    }
});

var post = mongoose.Schema({
    creater: String,
    title: String,
    description: String,
    url: String,
    image: String,
    location: String,
    like: Array,
    dislike: Array,
    comment: Array
});

let userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    profilepic: {
        type: String
    },
    id:{
        type:String
    },
    token:{
        type:String 
    }
});

mongoose.model('User', userSchema);
mongoose.model('project', register);
mongoose.model('post', post);