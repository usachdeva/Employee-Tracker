const inquirer = require("inquirer");
const { default: Choices } = require("inquirer/lib/objects/choices");
const DB = require("./db");
const { response } = require("express");
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
                    viewEmployees();
                    break;

                case "VIEW_EMPLOYEES_BY_DEPARTMENT":
                    viewEmployeesByDepartment();
                    break;

                case "VIEW_EMPLOYEES_BY_MANAGER":
                    viewEmployeesByManager();
                    break;

                case "ADD_EMPLOYEE":
                    addEmployee();
                    break;

                case "REMOVE_EMPLOYEE":
                    removeEmployee();
                    break;

                // case "UPDATE_EMPLOYEE_ROLE":
                //     updateEmployeeRole();
                //     break;

                // case "UPDATE_EMPLOYEE_MANAGER":
                //     updateEmployeeManager();
                //     break;

                case "VIEW_ROLES":
                    viewRoles();
                    break;

                case "ADD_ROLE":
                    addRole();
                    break;

                case "REMOVE_ROLE":
                    removeRole();
                    break;

                case "VIEW_DEPARTMENTS":
                    viewDepartments();
                    break;

                case "ADD_DEPARTMENT":
                    addDepartment();
                    break;

                case "REMOVE_department":
                    removeDepartment();
                    break;

                case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT":
                    viewUtilizedByDepartment();
                    break;

                case "QUIT":
                    quit();
                    break;
            }
        })
        .catch((err) =>
            console.error(`Error found the in the application ${err}`)
        );
}

// functions to call each query

// delete employee
function removeEmployee() {
    inquirer
        .prompt([
            {
                type: "number",
                name: "id",
                message: "Which employee you would like to remove?",
            },
        ])
        .then((response) => {
            let employee = response.id;
            return db.deleteEmployee(employee);
        })
        .then(() => loadQuestions());
}

// remove role
function removeRole() {
    inquirer
        .prompt([
            {
                type: "number",
                name: "id",
                message: "Which role you would like to remove?",
            },
        ])
        .then((response) => {
            let role = response.id;
            return db.deleteRole(role);
        })
        .then(() => loadQuestions());
}

// remove department
function removeDepartment() {
    inquirer
        .prompt([
            {
                type: "number",
                name: "id",
                message: "Which department you would like to remove?",
            },
        ])
        .then((response) => {
            let department = response.id;
            return db.deleteDepartment(department);
        })
        .then(() => loadQuestions());
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

// add employee
function addEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "firstName",
                message: "Enter the First name",
            },
            { type: "input", name: "lastName", message: "Enter the Last name" },
            {
                type: "list",
                name: "role_id",
                message: "Select the role",
                choices: [
                    {
                        name: "Salesperson",
                        value: 2,
                    },
                    {
                        name: "Software Engineer",
                        value: 4,
                    },
                    {
                        name: "Accountant",
                        value: 6,
                    },
                    {
                        name: "Lawyer",
                        value: 8,
                    },
                ],
            },
            {
                type: "list",
                name: "manager_id",
                message: "Select the manager",
                choices: [
                    {
                        name: "Clark Kent - Legal",
                        value: 1,
                    },
                    {
                        name: "Shayera Hol - Engineer",
                        value: 4,
                    },
                    {
                        name: "Barry Allen - Sales",
                        value: 5,
                    },
                    {
                        name: "Bruce Wayne - Account",
                        value: 7,
                    },
                ],
            },
        ])
        .then((response) => {
            let first_name = response.firstName;
            let last_name = response.lastName;
            let role_id = response.role_id;
            let manager_id = response.manager_id;
            return db.addAnEmployee(first_name, last_name, role_id, manager_id);
        })
        .then(() => loadQuestions())
        .catch((err) => console.error(err));
}

//view all employees
function viewEmployees() {
    db.findAllEmployees()
        .then(({ rows }) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        })
        .then(() => loadQuestions());
}

// view employees by department
function viewEmployeesByDepartment() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "department",
                message: "Which department employees you would like?",
                choices: [
                    {
                        name: "Sales",
                        value: "Sales",
                    },
                    {
                        name: "Engineering",
                        value: "Engineering",
                    },
                    {
                        name: "Finance",
                        value: "Finance",
                    },
                    {
                        name: "Legal",
                        value: "Legal",
                    },
                ],
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
        .then(() => loadQuestions());
}

// add a role
function addRole() {
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
                choices: [
                    {
                        name: "Sales",
                        value: 1,
                    },
                    {
                        name: "Engineering",
                        value: 2,
                    },
                    {
                        name: "Finance",
                        value: 3,
                    },
                    {
                        name: "Legal",
                        value: 4,
                    },
                ],
            },
        ])
        .then((response) => {
            db.addInRole(response.title, response.salary, response.department);
        })
        .then(() => loadQuestions())
        .catch((err) => console.error(`Error found : ${err}`));
}

// employee by  manager
// not working
function viewEmployeesByManager() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "manager",
                message: "Which manager you would like?",
                choices: [
                    {
                        name: "Clark Kent - Legal",
                        value: 1,
                    },
                    {
                        name: "Shayera Hol - Engineer",
                        value: 4,
                    },
                    {
                        name: "Barry Allen - Sales",
                        value: 5,
                    },
                    {
                        name: "Bruce Wayne - Account",
                        value: 7,
                    },
                ],
            },
        ])
        .then((response) => {
            let manager_id = response.manager;
            return db.employeeManager(manager_id);
        })
        .then(({ rows }) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        })
        .then(() => loadQuestions())
        .catch((err) => console.error(err));
}

init();
