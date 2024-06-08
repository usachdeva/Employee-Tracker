const pool = require("./connection");

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

    // view employees as per the department
    viewEmployeesByDepartment(department) {
        return this.query(
            `SELECT e.id, e.first_name, e.last_name, r.title, d.name as department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) as manager from employee e join role r on e.role_id = r.id join department d on r.department_id = d.id LEFT JOIN 
            employee m ON e.manager_id = m.id WHERE d.name = ($1);`,
            [department]
        );
    }

    // add a role
    addInRole(name, salary, department) {
        this.query(
            `INSERT INTO ROLE (title, salary, department_id) VALUES ($1, $2, $3);`,
            [name, salary, department]
        );
    }

    // employee by manager
    employeeManager(manager_id) {
        return this.query(
            `SELECT e.id, e.first_name, e.last_name, r.title, d.name as department_name, e.manager_id, r.salary, CONCAT(m.first_name, ' ', m.last_name) as manager from employee e join role r on e.role_id = r.id join department d on r.department_id = d.id LEFT JOIN 
        employee m ON e.manager_id = m.id WHERE e.manager_id = ($1);`,
            [manager_id]
        );
    }

    // add an employee
    addAnEmployee(first_name, last_name, role_id, manager_id) {
        return this.query(
            `INSERT INTO employee(first_name, last_name, role_id, manager_id) values ($1, $2, $3, $4)`,
            [first_name, last_name, role_id, manager_id]
        );
    }

    // budget by department
    budgetDepartment() {
        return this.query(
            `select d.name as department_name, SUM(r.salary) as utilized_budget from role r join department d on d.id = r.department_id Group by d.name; `
        );
    }

    // delete department
    deleteDepartment(name) {
        return this.query(`delete from department where name = ($1);`, [name]);
    }

    // delete a role
    deleteRole(title) {
        return this.query(`delete from role where title = ($1);`, [title]);
    }

    // delete an employee
    deleteEmployee(first_name) {
        return this.query(`delete from employee where first_name = ($1);`, [
            first_name,
        ]);
    }

    // roles available now
    rolesAvailable() {
        return this.query(`select title from role;`);
    }

    // employees avaialble now
    employeeAvailable() {
        return this.query(`select first_name from employee;`);
    }

    // departments available now
    departmentAvailable() {
        return this.query(`select name from department;`);
    }

    // managers available now
    managerAvailable() {
        return this
            .query(`SELECT e.id, CONCAT(e.first_name,' ', e.last_name) as name, r.title from employee e join role r on e.role_id = r.id join department d on r.department_id = d.id LEFT JOIN 
        employee m ON e.manager_id = m.id WHERE e.manager_id IS NULL;`);
    }
}

module.exports = DB;
