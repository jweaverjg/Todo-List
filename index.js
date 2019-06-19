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
    password: 'password',
    //database: 'multiple_todo_list'
});
db.connect();

// CREATE THE DATABASE
db.query(`CREATE DATABASE IF NOT EXISTS multi_todo_list;`);
db.query(`USE multi_todo_list;`);
db.query(`CREATE TABLE IF NOT EXISTS lists(
            id INT AUTO_INCREMENT,
            list_name VARCHAR(200),
            user_id INT,
            PRIMARY KEY(id)
        );`);
db.query(`CREATE TABLE IF NOT EXISTS users(
            id INT AUTO_INCREMENT,
            username VARCHAR(20),
            PRIMARY KEY(id)
        );`);
db.query(`CREATE TABLE IF NOT EXISTS todo_lists(
            id INT AUTO_INCREMENT,
            todo_title VARCHAR(200),
            todo_description TEXT,
            is_done TINYINT(1),
            user_id INT,
            list_id INT,
            PRIMARY KEY(id)
        );`);

// CONNECT THE STYLESHEET
app.use(express.static(path.join(__dirname, '/static')));

// MIDDLEWARE FOR PARSING JSON DATA
app.use(express.json());

// MIDDLEWARE FOR PARSING URL ENCODED DATA
app.use(express.urlencoded({extended: false}));

// GIVE THE APPLICATION FUNCTIONALITY -----------------------------------
// SIGN-IN PAGE
app.get('/', (req, res) => {
    res.render('sign-in');
});


app.post('/', (req, res) => {
    db.query('SELECT * FROM users WHERE username = ?', [req.body.username],
    (err, result) => {
        if(err) throw err;
        if(result.length != 0){
            res.redirect(`/lists?user=${result[0].id}`)
        } else {
            res.redirect('/');
        }
    });
});

// SIGN-UP PAGE
app.get('/sign-up', (req, res) => {
    res.render('sign-up');
});

app.post('/sign-up', (req, res) => {
    if(req.body.username){
        db.query('INSERT INTO users (username) values (?)',
        [req.body.username, 0], (err, response) => {
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                }
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/sign-up');
    }
});

// VIEW OF ALL TASK LISTS
app.get('/lists', (req, res) => {
    let username;
    db.query('SELECT * FROM users WHERE id = ?', [req.query.user], (err, response) => {
        if(err) throw err;
        username = response[0].username;
    });
    db.query('SELECT * FROM lists WHERE user_id = ?', [req.query.user], (err, response) => {
        if(err) throw err;
        // GET NUMBER OF TASKS FOR EACH TASK LIST
        db.query(`SELECT list_id, COUNT(list_id) AS num_tasks FROM todo_lists WHERE user_id = ? GROUP BY list_id`,[req.query.user], (err, result) => {
            if(err) throw err
            let numTasks = result.filter((arr) => arr.list_id != null).map(arr => arr.num_tasks);
            let listIds = result.filter((arr) => arr.list_id != null).map(arr => arr.list_id);
            for(let i = 0; i < response.length; i++){
                let index = listIds.indexOf(response[i].id);
                if(index > -1){
                    response[i].num_tasks = numTasks[index];
                } else {
                    response[i].num_tasks = 0;
                }
                if(response[i].num_tasks == 1){
                    response[i].num_tasks += ' task';
                } else {
                    response[i] .num_tasks += ' tasks';
                }
            }
            res.render('lists', {response, user: req.query.user, username})
        });
    });
});

// CREATE A NEW LIST
app.get('/create-list', (req, res) => {
    res.render('create-list', {user: req.query.user});
});


app.post('/create-list', (req, res) => {
    db.query('INSERT INTO lists (list_name, user_id) values (?, ?)',
    [req.body.list_title, req.query.user], (err, response) => {
        if(err) throw err;
        res.redirect(`/lists?user=${req.query.user}`);
    });
});

// VIEW INSIDE OF A LIST
app.get('/index?:user', (req, res) => {
    db.query('SELECT * FROM todo_lists WHERE user_id = ? AND list_id = ?',
     [req.query.user, req.query.list], (err, todoList) => {
        if(err){
            throw err;
        }
        res.render('index', {todoList, user: req.query.user, list: req.query.list})
    });
});


// HANDLES CHANGES TO THE CHECKBOX. REQUESTS COME FROM JQUERY IN script.js
app.get('/checkbox', (req, res) => {
    db.query('UPDATE todo_lists SET is_done = ? WHERE id = ?',
     [req.query.is_done, req.query.id], (err, result) => {
        if(err) throw err;
    });
    res.end();
});

// DETAILS PAGE
app.get('/detail', (req, res) => {
    db.query('SELECT * FROM todo_lists WHERE id = ? AND user_id = ?',
     [req.query.id, req.query.user], (err, result) => {
        if(err) throw err;
        res.render('detail', {todo: result[0], user: req.query.user, list: req.query.list});
    });
});


// EDIT PAGE
app.get('/edit', (req, res) => {
    db.query('SELECT * FROM todo_lists WHERE id=? AND user_id = ?',
     [req.query.id, req.query.user], (err, result) => {
        if(err) throw err;
        res.render('edit', {todo: result[0], user: req.query.user, list: req.query.list});
    });
});

app.post('/edit', (req, res) => {
    db.query('UPDATE todo_lists SET todo_description = ? WHERE id = ? AND user_id = ?',
     [req.body.todo_description, req.query.id, req.query.user], (err, response) => {
        if(err) throw err;
        res.redirect(`/index?user=${req.query.user}&list=${req.query.list}`);
    });
});

// CREATE PAGE
app.get('/create', (req, res) => {
    res.render('create', {user: req.query.user, list: req.query.list});
});

app.post('/create', (req, res) => {
    db.query('INSERT INTO todo_lists (todo_title, todo_description, is_done, user_id, list_id) values (?, ?, ?, ?, ?)',
    [req.body.todo_title, req.body.todo_description, 0, req.query.user, req.query.list], (err, response) => {
        if(err) throw err;
        res.redirect(`/index?user=${req.query.user}&list=${req.query.list}`);
    });
});


// DELETE PAGE
app.get('/delete', (req, res) => {
    db.query('DELETE FROM todo_lists WHERE id = ? AND user_id = ? AND list_id = ?',
     [req.query.id, req.query.user, req.query.list], (err, response) => {
        if(err) throw err;
        res.redirect(`/index?user=${req.query.user}&list=${req.query.list}`);
    });
});

// DELETE LIST PAGE
app.get('/delete-list', (req, res) => {
    if(parseInt(req.query.nt) === 0){
        db.query('DELETE FROM lists WHERE id = ? AND user_id = ?',
         [req.query.list, req.query.user], (err, response) => {
            if(err) throw err;
            res.redirect(`/lists?user=${req.query.user}`)
        });
    } else {
        res.render(`delete-list`,{user: req.query.user, list: req.query.list});
    }
});

app.get('/delete-list-confirm', (req, res) => {
    db.query('DELETE FROM todo_lists WHERE user_id = ? and list_id = ?',
     [req.query.user, req.query.list], (err, response) => {
        if(err) throw err;
        res.redirect(`/delete-list?user=${req.query.user}&list=${req.query.list}&nt=0`);
     });
});

// START THE SERVER
app.listen(5000, () => console.log("Server is live on port 5000"));