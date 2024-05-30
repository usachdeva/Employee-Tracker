const inquirer = require("inquirer");
const { default: Choices } = require("inquirer/lib/objects/choices");

// it will load when the program starts
const init = () => {
    console.log("Welcome to the employee tracker");
    loadQuestions();
};

// db queries
class DB {
    constructor() {}

    async query(sql, args = []) {
        const client = await pool.connect();
        try {
            const result = await client.query(sql, args);
            return result;
        } catch (err) {
            console.error(err);
        } finally {
            client.release();
        }
    }

    // view all departments
    findAllDepartments() {
        return this.query(`SELECT * FROM DEPARTMENT;`);
    }

    // view all roles
    findAllRoles() {
        return this.query(
            `SELECT r.id, r.title, d.name as department_name, r.salary from role r join department d on r.department_id = d.id;`
        );
    }

    // view all employees
    findAllEmployees() {
        return this
            .query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name as department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) as manager from employee e join role r on e.role_id = r.id join department d on r.department_id = d.id LEFT JOIN 
        employee m ON e.manager_id = m.id;`);
    }

    //add a department
    addInDepartment(department) {
        return this.query(`INSERT INTO department(name) VALUES ($1)`, [
            department,
        ]);
    }
}

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
                    viewEmployees(); //done
                    break;

                // case "VIEW_EMPLOYEES_BY_DEPARTMENT":
                //     viewEmployeesByDepartment();
                //     break;

                // case "VIEW_EMPLOYEES_BY_MANAGER":
                //     viewEmployeesByManager();
                //     break;

                // case "ADD_EMPLOYEE":
                //     addEmployee();
                //     break;

                // case "REMOVE_EMPLOYEE":
                //     removeEmployee();
                //     break;

                // case "UPDATE_EMPLOYEE_ROLE":
                //     updateEmployeeRole();
                //     break;

                // case "UPDATE_EMPLOYEE_MANAGER":
                //     updateEmployeeManager();
                //     break;

                case "VIEW_ROLES":
                    viewRoles(); //done
                    break;

                // case "ADD_ROLE":
                //     addRole();
                //     break;

                // case "REMOVE_ROLE":
                //     removeRole();
                //     break;

                case "VIEW_DEPARTMENTS":
                    viewDepartments(); //done
                    break;

                case "ADD_DEPARTMENT":
                    addDepartment(); //done
                    break;

                // case "REMOVE_department":
                //     removeDepartment();
                //     break;

                // case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT":
                //     viewUtilizedByDepartment();
                //     break;

                // case "QUIT":
                //     quit();
                //     break;
            }
        })
        .catch((err) =>
            console.error(`Error found the in the application ${err}`)
        );
}

// functions to call each query

//view all employees
function viewEmployees() {
    db.findAllEmployees()
        .then(({ rows }) => {
            let employees = rows;
            console.log("/n");
            console.table(employees);
        })
        .then(() => loadQuestions());
}

// view all departments
function viewDepartments() {
    db.findAllDepartments()
        .then(({ rows }) => {
            let departments = rows;
            console.log("/n");
            console.table(departments);
        })
        .then(() => loadQuestions());
}

// view all roles
function viewRoles() {
    db.findAllRoles()
        .then(({ rows }) => {
            let roles = rows;
            console.log("/n");
            console.table(roles);
        })
        .then(() => loadQuestions());
}

// add a department
// function addDepartment() {
//     db.addInDepartment(department).then(inquirer.prompt([

//     ]));
// }

init();

module.exports = DB;
