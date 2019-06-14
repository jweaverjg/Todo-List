// IMPORTS
const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");
const path = require("path");

// CREATE AN INSTANCE OF AN EXPRESS APPLICATION
const app = express();

module.exports = app;

// LET THE APPLICATION KNOW THAT IT SHOULD USE HANDLEBARS
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// CREATE DATABASE INSTANCE AND CONNECT TO IT
const db = mysql.createConnection({
    host: 'localhost',
    user: 'todo_user',
    password: 'password'
});
db.connect();

// CREATE THE DATABASE
db.query(`CREATE DATABASE IF NOT EXISTS todo_list;`);
db.query(`USE todo_list;`);
db.query(`CREATE TABLE IF NOT EXISTS todo(
            id INT AUTO_INCREMENT,
            todo_title VARCHAR(200),
            todo_description TEXT,
            is_done TINYINT(1),
            PRIMARY KEY(id)
        );`);

// CONNECT THE STYLESHEET
app.use(express.static(path.join(__dirname, '/static')));

// MIDDLEWARE FOR PARSING JSON DATA
app.use(express.json());

// MIDDLEWARE FOR PARSING URL ENCODED DATA
app.use(express.urlencoded({extended: false}));

// GIVE THE APPLICATION FUNCTIONALITY -----------------------------------
// MAIN DISPLAY PAGE
app.get('/', (req, res) => {
    db.query('SELECT * FROM todo', (err, todoList) => {
        if(err){
            if(err.code == 'ER_NO_DB_ERROR'){
                createDatabase();
            } else {
                throw err;
            }
        }
        res.render('index', {todoList})
    });
});

// HANDLES CHANGES TO THE CHECKBOX. REQUESTS COME FROM JQUERY IN script.js
app.get('/checkbox', (req, res) => {
    db.query('UPDATE todo SET is_done = ? WHERE id = ?',[req.query.is_done, req.query.id], (err, result) => {
        if(err) throw err;
    });
    res.end();
});

// DETAILS PAGE
app.get('/detail?:id', (req, res) => {
    db.query('SELECT * FROM todo WHERE id = ?', [req.query.id], (err, result) => {
        if(err) throw err;
        res.render('detail', {todo: result[0]});
    });
});

// EDIT PAGE
app.get('/edit?:id', (req, res) => {
    db.query('SELECT * FROM todo WHERE id=?', [req.query.id], (err, result) => {
        if(err) throw err;
        res.render('edit', {todo: result[0]});
    });
});

app.post('/edit?:id', (req, res) => {
    db.query('UPDATE todo SET todo_description = ? WHERE id = ?',
     [req.body.todo_description, req.query.id], (err, response) => {
        if(err) throw err;
        res.redirect("/");
    });
});

// CREATE PAGE
app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', (req, res) => {
    db.query('INSERT INTO todo (todo_title, todo_description, is_done) values (?, ?, ?)',
    [req.body.todo_title, req.body.todo_description, 0], (err, response) => {
        if(err) throw err;
        res.redirect('/');
    });
});


// DELETE PAGE
app.get('/delete?:id', (req, res) => {
    db.query('DELETE FROM todo WHERE id = ?', [req.query.id], (err, response) => {
        if(err) throw err;
        res.redirect("/");
    });
});

// START THE SERVER
app.listen(5000, () => console.log("Server is live on port 5000"));