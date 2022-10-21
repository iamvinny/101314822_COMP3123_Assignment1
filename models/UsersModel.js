const mongoose = require('mongoose');

// create a mongoose Schema having the fields as mentioned above
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    }
});

module.exports = mongoose.model("users", userSchema);