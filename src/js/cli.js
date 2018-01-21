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
        }, {
            type: 'input',
            name: 'title',
            message: "What's your project name? (for the page title)"
        }, {
		    type: 'confirm',
		    name: 'analytics',
		    message: 'Do you have a Google Analytics ID?',
		    default: false
		}]).then(b => {
            array.url = b.url
            array.logo = b.logo
            array.copyright = b.copyright
			array.title = b.title
			if (b.analytics === true) {
				inquirer.prompt({
					type: 'input',
		            name: 'id',
		            message: "What's your Google Analytics ID (UA-XXXXXX-X)?"
				}).then(c => {
					array.analytics = c.id
					dealWithIt([array])
				})
			} else {
				dealWithIt([array])
			}
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
        }, {
            type: 'input',
            name: 'title',
            message: "What's your project name? (for the page title)"
        }, {
		    type: 'confirm',
		    name: 'analytics',
		    message: 'Do you have a Google Analytics ID?',
		    default: false
		}]).then(b => {
            array.paths = b.paths
            array.logo = b.logo
            array.copyright = b.copyright
			array.title = b.title
			if (b.analytics === true) {
				inquirer.prompt({
					type: 'input',
		            name: 'id',
		            message: "What's your Google Analytics ID (UA-XXXXXX-X)?"
				}).then(c => {
					array.analytics = c.id
					dealWithIt([array])
				})
			} else {
				dealWithIt([array])
			}
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
