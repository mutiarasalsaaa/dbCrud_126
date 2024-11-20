const express = require('express');
const todoRoutes = require('./routes/tododb.js')
const app = express();

require('dotenv').config();
const port = process.env.PORT;

const expressLayout = require('express-ejs-layouts')

const db = require('./database/db')

app.use(expressLayout);

app.use(express.json());

app.use('/todos', todoRoutes);
app.set('view engine', 'ejs');
app.get('/', (req,res) => {
    res.render('index',{
        layout: 'layouts/main-layout'
    });
});

app.get('/contact', (req,res) => {
    res.render('contact', {
        layout: 'layouts/main-layout'
    });
});

app.get('/todo-view', (req, res) => {
    db.query('SELECT * FROM todos', (err, todos) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('todo', {
            layout: 'layouts/main-layout',
            todos: todos
        });
    });
});

app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}/`);
});
