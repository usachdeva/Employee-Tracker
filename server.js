const inquirer = require("inquirer");
const { default: Choices } = require("inquirer/lib/objects/choices");
const DB = require("./db");
const colors = require("colors");

// it will load when the program starts
const init = () => {
    console.log("Welcome to the employee tracker");
    loadQuestions();
};

const db = new DB();

// function to ask questions to make the choice
function loadQuestions() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "choice",
                message: "What would you like to do?",
                choices: [
                    {
                        name: "View all employees",
                        value: "VIEW_EMPLOYEES",
                    },
                    {
                        name: "View all employees by department",
                        value: "VIEW_EMPLOYEES_BY_DEPARTMENT",
                    },
                    {
                        name: "View all employees by manager",
                        value: "VIEW_EMPLOYEES_BY_MANAGER",
                    },
                    {
                        name: "Add employee",
                        value: "ADD_EMPLOYEE",
                    },
                    {
                        name: "Remove employee",
                        value: "REMOVE_EMPLOYEE",
                    },
                    {
                        name: "Update employee role",
                        value: "UPDATE_EMPLOYEE_ROLE",
                    },
                    {
                        name: "Update employee manager",
                        value: "UPDATE_EMPLOYEE_MANAGER",
                    },
                    {
                        name: "View all roles",
                        value: "VIEW_ROLES",
                    },
                    {
                        name: "Add role",
                        value: "ADD_ROLE",
                    },
                    {
                        name: "Remove role",
                        value: "REMOVE_ROLE",
                    },
                    {
                        name: "View all department",
                        value: "VIEW_DEPARTMENTS",
                    },
                    {
                        name: "Add department",
                        value: "ADD_DEPARTMENT",
                    },
                    {
                        name: "Remove department",
                        value: "REMOVE_department",
                    },
                    {
                        name: "View Total Utilized Budget By Department",
                        value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT",
                    },
                    {
                        name: "Quit",
                        value: "QUIT",
                    },
                ],
            },
        ])
        .then((response) => {
            let choice = response.choice;

            // calling the approprite function
            switch (choice) {
                case "VIEW_EMPLOYEES":
                    viewEmployees(); //working
                    break;

                case "VIEW_EMPLOYEES_BY_DEPARTMENT":
                    viewEmployeesByDepartment(); //working
                    break;

                case "VIEW_EMPLOYEES_BY_MANAGER":
                    viewEmployeesByManager(); //working
                    break;

                case "ADD_EMPLOYEE":
                    addEmployee();
                    break;

                case "REMOVE_EMPLOYEE":
                    removeEmployee(); //working
                    break;

                case "UPDATE_EMPLOYEE_ROLE":
                    updateEmployeeRole(); //working
                    break;

                case "UPDATE_EMPLOYEE_MANAGER":
                    updateEmployeeManager(); //working
                    break;

                case "VIEW_ROLES":
                    viewRoles(); //working
                    break;

                case "ADD_ROLE":
                    addRole(); //working
                    break;

                case "REMOVE_ROLE":
                    removeRole(); //working
                    break;

                case "VIEW_DEPARTMENTS":
                    viewDepartments(); //working
                    break;

                case "ADD_DEPARTMENT":
                    addDepartment(); //working
                    break;

                case "REMOVE_department":
                    removeDepartment(); //working
                    break;

                case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT":
                    viewUtilizedByDepartment(); //working
                    break;

                case "QUIT":
                    quit(); //working
                    break;
            }
        })
        .catch((err) =>
            console.error(`Error found the in the application ${err}`)
        );
}

// functions to call each query

// add employee
async function addEmployee() {
    try {
        // Prompt user to enter the first name
        let { firstName: first_name } = await inquirer.prompt({
            type: "input",
            name: "firstName",
            message: "Enter the First name",
        });

        // Prompt user to enter the last name
        let { lastName: last_name } = await inquirer.prompt({
            type: "input",
            name: "lastName",
            message: "Enter the Last name",
        });

        // fetch available managers
        let { rows: managerRows } = await db.managerAvailable();
        let choices1 = managerRows.map((row) => ({
            name: row.name,
            value: row.id,
        }));

        // Prompt user to select a manager
        let { manager: manager_id } = await inquirer.prompt([
            {
                type: "list",
                name: "manager",
                message: "Please select manager name",
                choices: choices1,
            },
        ]);

        // fetch available roles
        let { rows: roles } = await db.rolesAvailable();
        let choices2 = roles.map((row) => ({
            name: row.title,
            value: row.id,
        }));

        // Prompt user to select roles
        let { role: role_id } = await inquirer.prompt([
            {
                type: "list",
                name: "role",
                message: "Please select role",
                choices: choices2,
            },
        ]);

        await db.addAnEmployee(first_name, last_name, role_id, manager_id);

        // Fetch and display all employees
        let { rows: allEmployees } = await db.findAllEmployees();
        console.log("\n");
        console.table(allEmployees);

        // Reload questions
        loadQuestions();
    } catch (err) {
        console.error(err);
    }
}

// update employee role
// choices1 = available employee
// choices2 = available roles
async function updateEmployeeRole() {
    try {
        // available employees
        let { rows: employeeRows } = await db.employeeAvailable();
        let choices1 = employeeRows.map((row) => row.first_name);

        // Prompt user to select an employee
        let { employee: selectedEmployee } = await inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Please select employee name",
                choices: choices1,
            },
        ]);

        // Fetch available roles
        let { rows: roles } = await db.rolesAvailable();
        let choices2 = roles.map((row) => ({ name: row.title, value: row.id }));
        console.log(choices2);

        // Prompt user to select a role
        let { role: roleId } = await inquirer.prompt([
            {
                type: "list",
                name: "role",
                message: "Please select a role",
                choices: choices2,
            },
        ]);

        await db.updateEmployeeRole(roleId, selectedEmployee);

        // Fetch and display all employees
        let { rows: allEmployees } = await db.findAllEmployees();
        console.log("\n");
        console.table(allEmployees);

        // Reload questions
        loadQuestions();
    } catch (err) {
        console.error(err);
    }
}

// update employee manager
// choices1 = available employees
// choices2 = available manager
async function updateEmployeeManager() {
    try {
        // Fetch available employees
        let { rows: employeeRows } = await db.employeeAvailable();
        let choices1 = employeeRows.map((row) => row.first_name);

        // Prompt user to select an employee
        let { employee: selectedEmployee } = await inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Please select employee name",
                choices: choices1,
            },
        ]);

        // Fetch available managers
        let { rows: managerRows } = await db.managerAvailable();
        let choices2 = managerRows.map((row) => ({
            name: row.name,
            value: row.id,
        }));

        // Prompt user to select a manager
        let { manager: selectedManagerId } = await inquirer.prompt([
            {
                type: "list",
                name: "manager",
                message: "Please select manager name",
                choices: choices2,
            },
        ]);

        // Update the selected employee's manager
        await db.updateManager(selectedManagerId, selectedEmployee);

        // Fetch and display all employees
        let { rows: allEmployees } = await db.findAllEmployees();
        console.log("\n");
        console.table(allEmployees);

        // Reload questions
        loadQuestions();
    } catch (err) {
        console.error(err);
    }
}

// delete employee
function removeEmployee() {
    db.employeeAvailable()
        .then(({ rows }) => {
            let employees = rows.map((row) => row.first_name);
            return employees;
        })
        .then((choices) => {
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "name",
                        message: "Which employee you would like to remove?",
                        choices: choices,
                    },
                ])
                .then((response) => {
                    let employee = response.name;
                    return db.deleteEmployee(employee);
                })
                .then(() => {
                    viewEmployees();
                })
                .then(() => loadQuestions());
        });
}

// remove role
function removeRole() {
    db.rolesAvailable()
        .then(({ rows }) => {
            let roles = rows.map((row) => ({
                name: row.title,
                value: row.id,
            }));
            return roles;
        })
        .then((choices) => {
            return inquirer
                .prompt([
                    {
                        type: "list",
                        name: "title",
                        message: "Which role you would like to remove?",
                        choices: choices,
                    },
                ])
                .then((response) => {
                    let role = response.title;
                    return db.deleteRole(role);
                })
                .then(() => {
                    viewRoles();
                })
                .then(() => loadQuestions());
        });
}

// remove department
function removeDepartment() {
    db.departmentAvailable()
        .then(({ rows }) => {
            let roles = rows.map((row) => row.name);
            return roles;
        })
        .then((choices) => {
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "name",
                        message: "Which department you would like to remove?",
                        choices: choices,
                    },
                ])
                .then((response) => {
                    let name = response.name;
                    return db.deleteDepartment(name);
                })
                .then(() => {
                    db.findAllDepartments().then(({ rows }) => {
                        let departments = rows;
                        console.log("\n");
                        console.table(departments);
                    });
                })
                .then(() => loadQuestions());
        });
}

// budget by each department
function viewUtilizedByDepartment() {
    db.budgetDepartment()
        .then(({ rows }) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        })
        .then(() => loadQuestions());
}

// quit the program
function quit() {
    console.log(colors.red(`\nSee you next time!`));
    process.exit();
}

//view all employees
function viewEmployees() {
    db.findAllEmployees()
        .then(({ rows }) => {
            let employees = rows;
            console.log("\n");
            console.log(typeof employees);
            console.table(employees);
        })
        .then(() => loadQuestions());
}

// view employees by department
function viewEmployeesByDepartment() {
    db.departmentAvailable()
        .then(({ rows }) => {
            let roles = rows.map((row) => row.name);
            return roles;
        })
        .then((choices) => {
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "department",
                        message: "Which department employees you would like?",
                        choices: choices,
                    },
                ])
                .then((response) => {
                    let department = response.department;
                    return db.viewEmployeesByDepartment(department);
                })
                .then(({ rows }) => {
                    let employees = rows;
                    console.log("\n");
                    console.table(employees);
                })
                .then(() => loadQuestions());
        });
}

// view all departments
function viewDepartments() {
    db.findAllDepartments()
        .then(({ rows }) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => loadQuestions());
}

// view all roles
function viewRoles() {
    db.findAllRoles()
        .then(({ rows }) => {
            let roles = rows;
            console.log("\n");
            console.table(roles);
        })
        .then(() => loadQuestions());
}

// add a department
function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "department",
                message: "Enter the name of the department",
            },
        ])
        .then((response) => {
            db.addInDepartment(response.department);
        })
        .then(() => viewDepartments())
        .then(() => loadQuestions());
}

// add a role
function addRole() {
    db.findAllDepartments()
        .then(({ rows }) => {
            return rows.map((row) => ({
                name: row.name,
                value: row.id,
            }));
        })
        .then((choices) => {
            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "title",
                        message: "Enter the name of the role",
                    },
                    {
                        type: "number",
                        name: "salary",
                        message: "Enter the salary of the role",
                    },
                    {
                        type: "list",
                        name: "department",
                        message: "What is the department for the role",
                        choices: choices,
                    },
                ])
                .then((response) => {
                    db.addInRole(
                        response.title,
                        response.salary,
                        response.department
                    );
                })
                .then(() => viewRoles())
                .then(() => loadQuestions())
                .catch((err) => console.error(`Error found : ${err}`));
        });
}

// employee by  manager
function viewEmployeesByManager() {
    db.managerAvailable()
        .then(({ rows }) => {
            const managers = rows.map((row) => ({
                name: row.name,
                value: row.id,
            }));
            console.log(managers);
            return managers;
        })
        .then((choices) => {
            return inquirer
                .prompt([
                    {
                        type: "list",
                        name: "manager",
                        message:
                            "Which manager would you like to view employees for?",
                        choices: choices,
                    },
                ])
                .then((response) => {
                    let managerId = response.manager;
                    console.log(managerId);
                    return db.employeeManager(managerId);
                })
                .then(({ rows }) => {
                    let employees = rows;
                    console.log("\n");
                    console.table(employees);
                })
                .then(() => loadQuestions())
                .catch((err) => console.error(err));
        });
}

init();
