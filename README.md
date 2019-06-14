# Todo-List
## Phase 2
### File Structure
```
├── static
│   ├── styles
│   │   └── style.css
│   └── script.js
├── views
│   ├── layouts
│   │   └── main.handlebars
│   ├── create.handlebars
│   ├── delete.handlebars
│   ├── edit.handlebars
│   └── index.handlebars
├── index.js
├── package-lock.json
└── package.json
```

### Instructions
First, in mysql enter the following commands:
```
mysql> CREATE USER 'todo_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
mysql> GRANT ALL PRIVILEGES ON * . * TO 'todo_user'@'localhost';
mysql> FLUSH PRIVILEGES;
```

Next, navigate to the folder where you have downloaded the project file and enter the following commands:
`.../To-Do_List_Phase_2> npm install`
	To install the necessary dependencies
		Dependencies are:
			Express
			Express-Handlebars
			jquery
			mysql
			
`.../To-Do_List_Phase_2> npm start`
	To start the program