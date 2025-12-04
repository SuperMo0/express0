const express = require('express');
const { log } = require('node:console');
const app = express();
const path = require('node:path');
const connectionString = process.env.DATABASE_URL;
const pg = require('pg');
const client = new pg.Client(connectionString);

client.connect().then(() => {
    console.log('connected to data base');
})

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
let data = require('./data.js');

async function getAll() {
    let result = await client.query('select * from messages');
    return result.rows;
}
app.get('/', async (req, res) => {
    let data = await getAll();
    res.render('index.ejs', { data });
});

async function insertMessage(name, message) {
    const sql = `
    insert into messages (username,message) values($1,$2)
    `
    try { client.query(sql, [name, message]); }
    catch (err) { log(err); }
}
app.post('/', async (req, res) => {
    console.log('recived new message');
    log(req.body);
    await insertMessage(req.body.name, req.body.message);
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, () => {
    console.log('server is listening');
});
