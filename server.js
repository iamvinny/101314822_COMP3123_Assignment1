const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const DB_URL = "mongodb+srv://root:IelABEKx2vngLmP7@cluster0.aklsnoa.mongodb.net/comp3123_assigment1?retryWrites=true&w=majority"
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// include routes
require('./routes/UserRoutes.js')(app);
require('./routes/EmployeeRoutes.js')(app);

mongoose.Promise = global.Promise;

// TODO - Update your mongoDB Atals Url here to Connect to the database
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database 'comp3123_assigment1' on Atlas Server");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


app.get('/', (req, res) => {
    res.send("<h1>Welcome to The Assignment 01, the below routes are available</h1> \
    <ul> /api/user/signup </ul> \
    ");
});


app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});