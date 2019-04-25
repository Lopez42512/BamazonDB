drop database if exists bamazonBD;

create database bamazonDB;

use bamazonDB;

create table products(
	id int not null auto_increment,
    product_name varchar(100) not null,
    department_name varchar(100) not null,
    price decimal(10,2) not null,
    stock int default 0,
    primary key(id)
);

insert into products(product_name, department_name, price, stock)
value('Dog Bone', 'Pets', 2.00, 15),
('Dog Leash', 'Pets', 15.00, 20),
('Days Gone', 'Video Game', 59.99, 30),
('Chair', 'Furniture', 99.99, 10),
('Bread', 'Grocery', 3.29, 50),
('IPhone', 'Electronic', 999.99, 30),
('Book', 'School Supplies', 4.49, 100),
('Shoes', 'FootWear', 49.99, 37),
('PS4', 'Video Game', 399.99, 8),
('Charger', 'Electronic', 29.99, 150);

select * from products;