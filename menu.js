var mysql = require('mysql');
var inquirer = require('inquirer');
var customer = require('./bamazonCustomer')
var manager = require('./bamazonManager')

var connection = mysql.createConnection({
    host: 'localhost',

    port: 8889,

    user: 'mamp',

    password: 'root',
    database: 'bamazonDB'
});
hello();
function hello(){
    connection.connect(function(err){
    if(err) throw err;
    menu();
})};

//Menu function to choose who is the user
function menu(){
    inquirer.prompt({
            name: 'choice',
            type: 'list',
            message: 'what would you like to do',
            choices: ['Shop', 'Manager', 'SuperVisor', 'Done']

    //This run a program based off the user choice   
    }).then(function(answer){
        switch(answer.choice){
            case 'Shop':
                customer();
                break;
            case 'Manager':
                manager();
                break;
            case 'Done':
                connection.end();
        }
    })
}

module.exports = hello;

// console.log(fs)