//npm install to get program to run
var mysql = require('mysql');
var inquirer = require('inquirer');
var menu = require('./menu');

var connection = mysql.createConnection({
    host: 'localhost',

    port: 8889,

    user: 'mamp',

    password: 'root',
    database: 'bamazonDB'
});

//function that displays the product before prompting user what they would like to purchase
function displayProduct(){
    connection.query('select * from products', function(err, res){
        if (err) throw err;
        for(var i = 0; i < res.length; i++){
            // console.log(res)
            console.log(`ID: ${res[i].id} | Product: ${res[i].product_name} | Department: ${res[i].department_name} | Price: ${res[i].price} | Stock: ${res[i].stock}`);
            console.log('')
        };
        start();
    });
};

//Gets user input on the product they would like to buy
function start(){
    inquirer.prompt([
        {
            name: 'id',
            type: 'input',
            message: 'What would you like to buy by ID'
        }
    ]).then(function(answer){
        doSomething(answer.id);
    })
}

//display the product the user would like to buy and prompts the function that ask the user how much they would like to purchase
function doSomething(res){
    connection.query('select * from products where ?', [{id: res}], function(err, res){
        console.log(`ID: ${res[0].id} | Product: ${res[0].product_name} | Department: ${res[0].department_name} | Price: ${res[0].price} | Stock: ${res[0].stock}`);
        purchaseAmt(res[0]);
    })

}

//Prompts the use on how much of the product they would like to purchase and then calculates a price for them
function purchaseAmt(res){
    inquirer.prompt([
        {
            name: 'stock',
            message: 'How many do you want to buy'
        }
    ]).then(function(answer){
        if(answer.stock > res.stock){
            console.log("We don't have that amount");
            purchaseAmt();
        }else{
            var price = answer.stock * res.price
            var upStock = res.stock - answer.stock;
            updateItem(upStock, res, price);
        }
    })
}

//This function updates the database with the new stock count and displays the price for the user
function updateItem(upStock,res,price) {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
            stock: upStock
            },
            {
                id: res.id
            }
        ],

    );

    // logs the actual query being run
    // console.log(query.sql);
    console.log(`Your total for product: ${res.product_name} will be $ ${price}`);
    menu();
}

module.exports = displayProduct


