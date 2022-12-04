const employeeSchema = require('../models/EmployeesModel.js');
const jwt = require('jsonwebtoken');

// Create middleware to authenticate the token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user ) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next() // pass the execution off to whatever request the client intended
    })
}

module.exports = function(app){

    /* +===================================================+ */
    /*           Get a list of all the employees             */
    /* +===================================================+ */
    app.get('/api/emp/employees', authenticateToken, (req, res) => {

        // return a list of all the employees
        employeeSchema.find({}, (err, employees) => {
            if (err) {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving employees."
                });
            } else {
                res.send(employees);
            }
        });
    
    });

    /* +===================================================+ */
    /*               Register a new employee                 */
    /* +===================================================+ */
    app.post('/api/emp/employees', authenticateToken, (req, res) => {
            
            // Create an object to be saved in the database
            const employee = new employeeSchema({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                gender: req.body.gender,
                salary: req.body.salary
            });

            // Save the employee in the database
            employee.save()
                .then(data => {
                    res.send(data);
                }
            ).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Employee."
                });
            }
        );

    });

    /* +===================================================+ */
    /*             Get Employee By Employee ID               */
    /* +===================================================+ */
    app.get('/api/emp/employees/:eid', authenticateToken, (req, res) => {

        // check if the employee id is not empty
        if(!req.params.eid) {
             res.status(400).send({
                message: "Employee ID can not be empty"
            });
        } else {
            // check if employee exists, then return the employee
            employeeSchema.findOne({_id: req.params.eid}, (err, employee) => {
                    if (employee) {
                        res.send(employee);
                    } else {
                        res.status(404).send({
                            message: "Employee not found with id " + req.params.eid
                        });
                    }
                }
            );
        }
        
    });

    /* +===================================================+ */
    /*            Update Employee By Employee ID             */
    /* +===================================================+ */
    app.put('/api/emp/employees/:eid', authenticateToken, (req, res) => {

        // check if the employee id is not empty
        if (!req.params.eid) {
            res.status(400).send({
                message: "Employee ID can not be empty"
            });
        } else {
            // get and update employee profile by employee id
            employeeSchema.findByIdAndUpdate(req.params.eid, {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email
                }, {
                    new: true
                })
                .then(employee => {
                    if (!employee) {
                        return res.status(404).send({
                            message: "Employee not found with id " + req.params.eid
                        });
                    }
                    // return the updated employee
                    res.send(employee);
                }).catch(err => {
                    if (err.kind === 'ObjectId') {
                        return res.status(404).send({
                            message: "Employee not found with id " + req.params.eid
                        });
                    } else {
                        return res.status(500).send({
                            message: "Error updating employee with id " + req.params.eid
                        });
                    }
                });
        }
    });

    /* +===================================================+ */
    /*  Delete Employee By Employee ID get query parameter   */
    /* +===================================================+ */
    app.delete('/api/emp/employees', authenticateToken, (req, res) => {
            
        // check if the employee id is not empty
        if (!req.query.eid) {
            res.status(400).send({
                message: "Employee ID can not be empty"
            });
        } else {
            // delete employee profile by employee id
            employeeSchema.findByIdAndRemove(req.query.eid)
                .then(employee => {
                    if (!employee) {
                        res.status(404).send({
                            message: "Employee not found with id " + req.query.eid
                        });
                    } else {
                        res.send({
                            message: "Employee deleted successfully!"
                        });
                    }
                }).catch(err => {
                    if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                        res.status(404).send({
                            message: "Employee not found with id " + req.query.eid
                        });
                    } else {
                        res.status(500).send({
                            message: "Could not delete employee with id " + req.query.eid
                        });
                    }
                });
        }
        
    });


}