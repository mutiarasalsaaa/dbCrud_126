const express = require('express');
const todoRoutes = require('./routes/tododb.js'); // Pastikan ini ada di folder routes
const expressLayout = require('express-ejs-layouts');
const db = require('./database/db.js');
const app = express();

// Load environment variables from .env
require('dotenv').config();
const port = process.env.PORT || 3002;

const session = require('express-session');
const authRoutes = require('./routes/authRoutes'); // Pastikan ini ada di folder routes
const { isAuthenticated } = require('./middlewares/middleware.js'); // Pastikan middleware ini ada di folder middlewares

// Middleware and settings
app.use(expressLayout);
app.use(express.json());
app.set('view engine', 'ejs');

// Routes
app.use('/todos', todoRoutes); // Menambahkan route untuk todos

app.use(express.urlencoded({ extended: true }));

// Konfigurasi express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set ke true jika menggunakan HTTPS
}));

// Menambahkan route untuk autentikasi
app.use('/', authRoutes);

// Rute untuk halaman utama
app.get('/', isAuthenticated, (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layout'
    });
});

// Rute untuk halaman kontak
app.get('/contact', isAuthenticated, (req, res) => {
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Halaman Contact'
    });
});

// Rute untuk halaman todo-view
app.get('/todo-view', isAuthenticated, (req, res) => {
    db.query('SELECT * FROM todos', (err, todos) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('todo', {
            layout: 'layouts/main-layout',
            todos: todos
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`); // Perbaikan console.log
});
