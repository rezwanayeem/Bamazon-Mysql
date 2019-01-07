// required dependencies
var inquirer = require('inquirer');
var mysql = require('mysql');

// My MySQL connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    // My username
    user: 'root',

    // My password
    password: "password",
    database: 'bamazon'
});
// Initialize connection to database
connection.connect(function (err) {
    if (err) throw err;
    start();
});
function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        promptProduct(res);
    });
}
function promptProduct() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
                itemId = res[i].item_id,
                productName = res[i].product_name,
                departmentName = res[i].department_name,
                price = res[i].price,
                stockQuantity = res[i].stock_quantity;
        }
        selectionPrompt();
    });
}
//Asked item to select and its quantity
function selectionPrompt() {

    inquirer
        .prompt([{
            type: "item",
            name: "itemId",
            message: "What is the ID of the item you would you like to purchase?",
        },
        {
            type: "item",
            name: "itemNumber",
            message: "How many units of this item would you like to purchase?",

        }
        ]).then(function (productPurchase) {

            //through database check stock_quantity
            // If quantity is greater than stock, it will decline the purchase
            // if not, then confirm the purchase

            connection.query("SELECT * FROM products WHERE item_id=?", productPurchase.itemId, function (err, res) {
                for (var i = 0; i < res.length; i++) {

                    if (productPurchase.itemNumber > res[i].stock_quantity) {
                        // declination prompt
                        console.log("Sorry! Insufficient quantity");
                        startPrompt();

                    } else {
                        //confirmation prompt
                        console.log("Successfully purchased");
                        console.log("Item: " + res[i].product_name);
                        console.log("Department: " + res[i].department_name);
                        console.log("Price: " + res[i].price);
                        console.log("Quantity: " + productPurchase.itemNumber);
                        console.log("Total: " + res[i].price * productPurchase.itemNumber);
                        //start again
                        start();
                    }
                }
            });
        });
}