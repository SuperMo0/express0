const express = require('express');
const { log } = require('node:console');
const app = express();
const path = require('node:path');


app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
let data = require('./data.js');

app.get('/', (req, res) => {

    res.render('index', { data });
});

app.post('/', (req, res) => {
    console.log('recived new message');
    data.push({ name: req.body.name, message: req.body.message, data: 'today' });
    res.redirect('/');
})

app.listen(3000, 'localhost', () => {
    console.log('server is listening on port', 3000);
});