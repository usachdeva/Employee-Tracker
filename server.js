const express = require("express");
const { Pool } = require("pg");

const DB = require("./db");

const PORT = process.env.PORT || 3001;

const app = express;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = new DB();

// show all departments
app.get("/api/departments", async (req, res) => {
    const { rows: departments } = db.findAllDepartments();
    console.table(departments);
    res.json(departments);
});

// show all roles
app.get("/api/roles", async (req, res) => {
    const { rows: roles } = db.findAllRoles();
    console.table(roles);
    res.json(roles);
});

// show all employees
app.get("/api/employees", async (req, res) => {
    const { rows: employees } = db.findAllEmployees();
    console.table(employees);
    res.json(employees);
});

// add a department
app.post("/api/department", (req, res) => {});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
