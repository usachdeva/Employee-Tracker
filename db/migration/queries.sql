-- \c employees_db;

-- select * from department;

-- select * from role;

-- select * from employee;

-- Update employee SET manager_id = 3 where first_name = 'Kara';

-- select * from employee;

UPDATE Update employee SET manager_id = ($1) where first_name = ($2);