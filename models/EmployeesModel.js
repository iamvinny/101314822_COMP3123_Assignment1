const mongoose = require('mongoose');

// _id = Object ID - Auto Generated
// first_name = String (100) - Required
// last_name = String (50) - Required
// email = String (50) - Unique
// gender = String (25)
// salary = Float - Required

// create a mongoose Schema having the fields as mentioned above
const employeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        maxlength: 100
    },
    last_name: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50
    },
    gender: {
        type: String,
        maxlength: 25
    },
    salary: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model("employees", employeeSchema);