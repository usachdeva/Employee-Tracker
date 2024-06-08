INSERT INTO department(name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Legal');  

INSERT INTO role(title,salary,department_id)
VALUES ('Sales Lead', 100000, 1),
       ('Salesperson', 80000, 1),
       ('Lead Engineer', 150000, 2),
       ('Software Engineer', 100000, 2),
       ('Account Manager', 150000, 3),
       ('Accountant', 90000, 3),
       ('Legal Team Lead', 250000, 4),
       ('Lawyer', 150000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Clark', 'Kent', 7, NULL),
       ('Kara', 'Kent', 8, 1),
       ('Shayera', 'Hol', 3, NULL),
       ('Diana', 'Princess', 4, 3),
       ('Barry', 'Allen', 1, NULL),
       ('Wally', 'West', 2, 5),
       ('Bruce', 'Wayne', 5, NULL),
       ('Damian', 'Wayne', 6, 7);