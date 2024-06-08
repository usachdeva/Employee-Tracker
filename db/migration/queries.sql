-- \c employees_db;

-- select * from department;

-- select * from role;

-- select * from employee;

SELECT e.id, e.first_name, e.last_name, r.title, d.name as department_name, e.manager_id, r.salary, CONCAT(m.first_name, ' ', m.last_name) as manager from employee e join role r on e.role_id = r.id join department d on r.department_id = d.id LEFT JOIN 
        employee m ON e.manager_id = m.id WHERE e.manager_id = 1;