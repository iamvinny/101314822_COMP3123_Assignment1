const userSchema = require('../models/UsersModel.js');

module.exports = function(app){

    /* +===================================================+ */
    /*  Create a New User with username, email and password  */
    /* +===================================================+ */
    app.post('/api/user/signup', (req, res) => {

        // Check if username and email already exists, then add the user to the database if not
        userSchema.findOne({username: req.body.username}, (err, user) => {
            if (user) {
                res.status(400).send({
                    message: "Username already exists"
                });
            } else {
                userSchema.findOne({email: req.body.email}, (err, user) => {
                    if (user) {
                        res.status(400).send({
                            message: "Email already exists"
                        });
                    } else {
                        // Create an object to be saved in the database
                        const user = new userSchema({
                            username: req.body.username,
                            email: req.body.email,
                            password: req.body.password
                        });

                        // Save the user in the database
                        user.save()
                            .then(data => {
                                res.send(data);
                            }).catch(err => {
                                res.status(500).send({
                                    message: err.message || "Some error occurred while creating the User."
                                });
                        });
                    }
                });
            }
        });
    
    });

    /* +===================================================+ */
    /*    Allow User to authenticate and access the system   */
    /* +===================================================+ */
    app.post('/api/user/login', (req, res) => {
        // Make sure username  and password are provided
        if(!req.body.username || !req.body.password) {
            res.status(400).send({
                status: false,
                message: "Username and password are required"
            });
        } else {
            // Check if password is correct and then return success or failure
            userSchema.findOne({username: req.body.username}, (err, user) => {
                if (user) {
                    if (req.body.password === user.password) {
                        res.send({
                            status: true,
                            username: user.username,
                            message: "User logged in successfully"
                        });
                    } else {
                        res.status(400).send({
                            status: false,
                            message: "Invalid Password"
                        });
                    }
                } else {
                    res.status(400).send({
                        status: false,
                        message: "Invalid Username"
                    });
                }
            });
        }
    });

}