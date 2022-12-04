const express = require('express');
const mongoose = require('mongoose');
const app = express();

const DB_URL = "mongodb+srv://root:IelABEKx2vngLmP7@cluster0.aklsnoa.mongodb.net/comp3123_assigment1?retryWrites=true&w=majority"
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

// include routes
require('./routes/UserRoutes.js')(app);
require('./routes/EmployeeRoutes.js')(app);

mongoose.Promise = global.Promise;

// connect to the database
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database 'comp3123_assigment1' on Atlas Server");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// return home page with routes information
app.get('/', (req, res) => {
    res.send("<h1>Welcome to The Assignment 01, the below routes are available</h1> \
    <ul> POST: /api/user/signup </ul> \
    <ul> POST: /api/user/login </ul> \
    <ul> GET: /api/emp/employees </ul> \
    <ul> POST: /api/emp/employees </ul> \
    <ul> GET: /api/emp/employees/{eid} </ul> \
    <ul> PUT: /api/emp/employees/{eid} </ul> \
    <ul> DELETE: /api/emp/employees?eid=xxx </ul> \
    ");
});

// listen for requests
app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});