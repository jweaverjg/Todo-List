# Todo-List
## Phase 3
### File Structure
```
├── static
│   ├── styles
│   │   └── style.css
│   └── script.js
├── views
│   ├── layouts
│   │   └── main.handlebars
│   ├── create-list.handlebars
│   ├── create.handlebars
│   ├── delete-list.handlebars
│   ├── delete.handlebars
│   ├── edit.handlebars
│   ├── index.handlebars
│   ├── lists.handlebars
│   ├── sign-in.handlebars
│   └── sign-up.handlebars
├── index.js
├── package-lock.json
└── package.json
```

### Changes
Phase 3 was given the ability to store the information from multiple users, and only allow those specific users to access their information.

Several new layouts were added to accomodate this.

### Instructions
First, in mysql enter the following commands:
```
mysql> CREATE USER 'todo_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
mysql> GRANT ALL PRIVILEGES ON * . * TO 'todo_user'@'localhost';
mysql> FLUSH PRIVILEGES;
```

Next, navigate to the folder where you have downloaded the project file and enter the following command:
			
`.../To-Do_List> npm start`

To start the program and install the necessary dependencies.

Dependencies are:
*Express
*Express-Handlebars
*jquery
*mysql