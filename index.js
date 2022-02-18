//required dependencies
const inquire = require('inquirer');
const cTable = require('console.table');
const figlet = require('figlet');
const sysql = require(mysql2);
require('dotenv').config();
const util = require('util');
const inquirer = require('inquirer');
const { type } = require('os');

const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    },
);

db.connect();
db.query = util.promisify(db.query);

//figlet for the employee manager display
figlet.text(`
    Employee
    Manager
`,
    (err, data) => {
        if (err) {
            console.log('Something went wrong, please try again');
            console.dir(err);
            return;
        }
        console.log(data);
        init();
    }
);

//first function
init = () => {
    return inquire.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'Please select an option',
            choices: [
                'View employees',
                'View roles',
                'View departments',
                'Add employee',
                'Update employee role',
                'Add role',
                'Add department',
                'Delete employee',
                'Delete role',
                'Delete department',
                'Quit'
            ],
        }
    ])
        .then((answers) => {
            switch (answers.mainMenu) {
                case 'View employees':
                    viewEmployees();
                    break;
                case 'View roles':
                    viewRoles();
                    break;
                case 'View departments':
                    viewDepartments();
                    break;
                case 'Add employee':
                    addEmployee();
                    break;
                case 'Update employee role':
                    updateEmployeeRole();
                    break;
                case 'Add role':
                    addRole();
                    break;
                case 'Add department':
                    addDepartment();
                    break;
                case 'Delete employee ':
                    deleteEmployee();
                    break;
                case 'Delete role':
                    deleteRole();
                    break;
                case 'Delete department':
                    deleteDepartment();
                    break;
                case 'Quit':
                    console.log('Thank You!');
                    process.exit();
                    break;
                default:
                    console.log('Error: no values found.');
                    break;
            }
        })
}

// functions for all the choices

//view employees
viewEmployees = () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name
AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name)
AS manager FROM employee
LEFT JOIN role on emplyee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id`,

        (err, results) => {
            if (err) {
                console.log(err);
                process.exit();
            } else {
                console.table(results);
                init();
            }
        })
};

//view roles
viewRoles = () => {
    db.query(`SELECT role.id, role.title, deoartment.name
    AS department, role.salart FORM role
    LEFT JOIN department on role.department_id = department.id;`,

        (err, results) => {
            if (err) {
                console.log(err);
                process.exit();
            } else {
                console.table(results);
                init();
            }
        })
};

// department function
viewDepartments = () => {
    db.query(`SELECT * FROM employees.department;`,

        (err, results) => {
            if (err) {
                console.log(err)
                process.exit();
            } else {
                console.table(results);
                init();
            }
        })
};

//employee function

addEmployee = async () => {
    const data = await db.query(`SELECT role.id, role.title, department.name
    AS department, role.salart FORM role
    LEFT JOIN department on role.department_id = department.id;`)

    const roles = data.map((role) => {
        return {
            name: `Role: ${role.title} in Department: ${role.department}.`,
            value: role.id,
        }
    })
    const inputData = await inquirer.prompt(
        [
            {
                type: 'input',
                name: 'firstName',
                message: 'What is employees first name?',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is employees last name?'
            },
            {
                type: 'input',
                name: 'manager',
                message: 'What is managers  name?',
            },
            {
                type: 'input',
                name: 'roleId',
                message: 'Select employees role',
                choices: roles,
            }
        ]
    )
    const manager = await db.query('SELECT manager_id FROM employee WHERE role_id - ?', [inputData.roleID]);

    const newEmployee = await db.query('INSERT INTO employee (first_name,  last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [inputData.firstName, inputData.lastName, inputData.roleID, manager[0].manager_id]);
    console.log('New employee has been added!')
    init();
};
//employee role funtion
updateEmployeeRole = () => {
    db.query('SELECT * FROM employees.employee;',
        (err, results) => {

            const employees = [];

            results.forEach(result => employees.push(
                {
                    name: result.first_name + ' ' + result.last_name,
                    value: result.id
                })
            );

            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'getEmployee',
                    message: 'Which emplayee do you wish to update?',
                    choices: employees
                },
            ])

                .then((data) => {

                    const employeeId = data.getEmployee;

                    db.query('SELECT * FROM emplayees.role;',

                        (err, results) => {

                            const roles = [];

                            results.forEach(result => roles.push(
                                {
                                    name: result.title,
                                    value: result.id
                                })
                            );

                            return inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'updateRole',
                                    message: "What is the employee's new role?",
                                    choices: roles
                                },
                            ])

                                .then((data) => {

                                    const roleId = data.updateRole;

                                    db.query('UPDATE employees.employee SET role_id = ?'[roleId, employeeId],

                                        (err, results) => {
                                            if (err) {
                                                console.log(err);
                                                process.exit();
                                            } else {
                                                console.log(`Employee role has been updated!`)
                                                init();
                                            }
                                        })
                                })
                        })
                })
        })
};

//new role function
addRole = () => {
    db.query('SELECT 8 FROM smployees.department;',

        (err, results) => {

            const departments = [];

            results.forEach(result => departments.push(
                {
                    name: result.name,
                    value: result.id
                }
            )
            );

            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'newRoleName',
                    message: 'What is employees new role?'
                },
                {
                    type: 'input',
                    name: 'newRoleDepartment',
                    message: 'What is the salary of new role?'
                },
                {
                    type: 'list',
                    name: 'newRoleDepartment',
                    message: 'Which department is the new role in?',
                    choices: departments
                }
            ])

                .then((data) => {
                    db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
                        [data.newRoleName, data.newRoleSalary, data.newRoleDepartment],

                        (err, results) => {
                            if (err) {
                                console.log(err);
                                process.exit();
                            } else {
                                console.log('New role added!');
                                init();
                            }
                        })
                })
        })
};

// department function

addDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartmentName',
            message: 'What is the name of the new department?',
        },
    ])
        .then(function (data) {

            db.query('INSERT INTO department (name) VALUES (?)', [data.newDepartmentName],
                (err, results) => {

                    if (err) {
                        console.log(err);
                        process.exit();
                    } else {
                        console.log('New department is added!')
                        init();
                    }
                })
        })
};

