const inquirer = require('inquirer');
const fs = require('fs');

let array = {};

inquirer.prompt({
    type: 'confirm',
    name: 'github',
    message: 'Is your documentation GitHub Wiki based?',
    default: true
}).then(a => {
    if (a.github === true) {
        array.type = "github";
        inquirer.prompt([{
            type: 'input',
            name: 'url',
            message: "What's the URL of the wiki?",
        }, {
            type: 'input',
            name: 'logo',
            message: "What's the URL of the logo you want to use?",
        }, {
            type: 'input',
            name: 'copyright',
            message: "What's your name? (for copyright)"
        }]).then(b => {
            array.url = b.url
            array.logo = b.logo
            array.copyright = b.copyright
            dealWithIt([array])
        })
    } else {
        array.type = "markdown"
        inquirer.prompt([{
            type: 'input',
            name: 'paths',
            message: "Copy and paste the names and paths of your files (like: { 'file': 'relative/path/to/file' })",
        }, {
            type: 'input',
            name: 'logo',
            message: "What's the URL of the logo you want to use?",
        }, {
            type: 'input',
            name: 'copyright',
            message: "What's your name? (for copyright)"
        }]).then(b => {
            array.paths = b.paths
            array.logo = b.logo
            array.copyright = b.copyright
            dealWithIt([array])
        })
    }
})

// save function
function dealWithIt(obj) {
    fs.writeFile(__dirname + "/../../dist/config.json", JSON.stringify(obj), err => {
        if (err) {
            return console.log(err);
        }
    });
}
