//npm install to get program to run
var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',

    port: 8889,

    user: 'mamp',

    password: 'root',
    database: 'bamazonDB'
});

// connection.connect(function(err){
//     if(err) throw err;
//     menu();
// });

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
                displayProduct();
                break;
            case 'Manager':
                password();
                break;
            case 'Done':
                connection.end();
        }
    })
}

//Temporary password for manager mode
var managerPassword = 'hello'

//Validate the user password to gain access to manager display
function password(){
    inquirer.prompt({
        name: 'password',
        type: 'password',
        mask: '*',
        message: 'Enter password',
    }).then(function(answer){
        if(answer.password === managerPassword){
            managerDisplay();
        }else{
            console.log('Wrong Password');
            password();
        }
    })
}

//Gets users response on what manager feature they will like to do
function managerDisplay(){
    inquirer.prompt({
        name: 'choice',
        type: 'list',
        message: 'what would you like to do',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Go Back']
    }).then(function(answer){
        //Runs a specific program based off the user choice
        switch(answer.choice){
            case 'View Products for Sale':
                managerDisplayProduct();
                break;
            case 'View Low Inventory':
                viewLowInv();
                break;
            case 'Add to Inventory':
                getInv();
                break;
            case 'Add New Product':
                addProduct();
                break;
            case 'Go Back':
                menu();
        }
    })
}

//Gets user input to add new product to database
function addProduct(){
    inquirer.prompt([{
        name: 'name',
        message: 'product name'
    },
    {
        name: 'depName',
        message: 'department name'
    },
    {
        name: 'price',
        message: 'How much is the product'
    },
    {
        name: 'stock',
        message: 'What is the stock of the product'
    }]).then(function(answer){
        console.log(answer)
        updateDB(answer);
    })
}

//Updates database based off of user input 
function updateDB(res){
    console.log('Adding a new product');
    console.log(res.name);

    var query = connection.query(
        'insert into products set ?',{
            product_name: res.name,
            department_name: res.depName,
            price: res.price,
            stock: res.stock
        },
        function(err){
            if (err) throw err;
        }
    );
    console.log(query.sql);
    console.log('Successfully added');
    //return user back to menu screen
    managerDisplay();
}

//Function that restocks inventory that the user chooses
function getInv(){
    //Displays the product
    connection.query('select * from products', function(err, res){
        if (err) throw err;
        for(var i = 0; i < res.length; i++){
            // console.log(res)
            console.log(`ID: ${res[i].id} | Product: ${res[i].product_name} | Department: ${res[i].department_name} | Price: ${res[i].price} | Stock: ${res[i].stock}`);
            console.log('')
        };
        //User picks what product they would like to restock and how much to stock
        inquirer.prompt([{
            name: 'choice',
            message: 'What would you like to update'
        },
        {
            name: 'amount',
            message: 'How much would you like to add'
        }]).then(function(answer){
            console.log(`ID: ${res[answer.choice - 1].id} | Product: ${res[answer.choice - 1].product_name} | Department: ${res[answer.choice - 1].department_name} | Price: ${res[answer.choice - 1].price} | Stock: ${res[answer.choice - 1].stock}`);
            //I had to treat the product as an object and subtract by 1 to get the true position, than I added the old stock with the stock being added to get the new stock number
            newAmount = parseInt(res[answer.choice -1].stock) + parseInt(answer.amount);
            id = res[answer.choice - 1].id;
            console.log(`New product stock amount is ${newAmount}`);
            addInv(newAmount, id)
        })
    })
};

//updated the database with the information I recieved from the getInv function
function addInv(newAmount, id){
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
            stock: newAmount
            },
            {
                id: id
            }
        ],

    );

    // logs the actual query being run
    console.log(query.sql);
    managerDisplay();
}

//A function that views items in inventory with a stock less than 5
function viewLowInv(){
    connection.query('select * from products having stock <= 5',
        function(err,res){
            if(err) throw err;
            for(var i = 0; i < res.length; i++){
                // console.log(res)
                console.log(`ID: ${res[i].id} | Product: ${res[i].product_name} | Department: ${res[i].department_name} | Price: ${res[i].price} | Stock: ${res[i].stock}`);
                console.log('')
            };
            managerDisplay();
        }
    )
};

//Function that displays the product before going to the manager menu
function managerDisplayProduct(){
    connection.query('select * from products', function(err, res){
        if (err) throw err;
        for(var i = 0; i < res.length; i++){
            // console.log(res)
            console.log(`ID: ${res[i].id} | Product: ${res[i].product_name} | Department: ${res[i].department_name} | Price: ${res[i].price} | Stock: ${res[i].stock}`);
            console.log('')
        };
        managerDisplay();
    })
}

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

