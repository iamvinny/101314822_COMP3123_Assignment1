const employeeSchema = require('../models/EmployeesModel.js');

module.exports = function(app){

    /* +===================================================+ */
    /*           Get a list of all the employees             */
    /* +===================================================+ */
    app.get('/api/emp/employees', (req, res) => {

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
    app.post('/api/emp/employees', (req, res) => {
            
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
    app.get('/api/emp/employees/:eid', (req, res) => {

        // check if the employee id is not empty
        if(!req.params.eid) {
            return res.status(400).send({
                message: "Employee ID can not be empty"
            });
        } else {
            // return employee profile by employee id
            employeeSchema.findById(req.params.eid, (err, employee) => {
                if (err) {
                    return res.status(404).send({
                        message: 'Employee not found with id ' + req.params.eid
                    });
                } else {
                    res.send(employee);
                }
            });
        }
        
    });

    /* +===================================================+ */
    /*            Update Employee By Employee ID             */
    /* +===================================================+ */
    app.put('/api/emp/employees/:eid', (req, res) => {

        // check if the employee id is not empty
        if (!req.params.eid) {
            return res.status(400).send({
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
                    res.send(employee);
                }).catch(err => {
                    if (err.kind === 'ObjectId') {
                        return res.status(404).send({
                            message: "Employee not found with id " + req.params.eid
                        });
                    }
                    return res.status(500).send({
                        message: "Error updating employee with id " + req.params.eid
                    });
                });
        }
    });

    /* +===================================================+ */
    /*            Delete Employee By Employee ID get query parameter             */
    /* +===================================================+ */
    app.delete('/api/emp/employees', (req, res) => {
            
        // check if the employee id is not empty
        if (!req.query.eid) {
            return res.status(400).send({
                message: "Employee ID can not be empty"
            });
        } else {
            // delete employee profile by employee id
            employeeSchema.findByIdAndRemove(req.query.eid)
                .then(employee => {
                    if (!employee) {
                        return res.status(404).send({
                            message: "Employee not found with id " + req.query.eid
                        });
                    }
                    res.send({
                        message: "Employee deleted successfully!"
                    });
                }).catch(err => {
                    if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                        return res.status(404).send({
                            message: "Employee not found with id " + req.query.eid
                        });
                    }
                    return res.status(500).send({
                        message: "Could not delete employee with id " + req.query.eid
                    });
                });
        }
        
    });


}