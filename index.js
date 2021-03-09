// HW 6 - Database Interactions and UI

const express = require('express')
const app = express()
const mysql = require('mysql')

let pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs290_chiue',
    password: '5051',
    database: 'cs290_chiue',
    dateStrings: true
})

app.use(express.static('public'))
app.set('port', 3005);

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Queries
const tableName = "exercises"
const getAllQuery = `SELECT * FROM ${tableName};`
const insertQuery = 'INSERT INTO exercises (name, reps, weight, units, date) VALUES ('
const updateQuery = `UPDATE ${tableName} SET name=?, rep=?, weight=?, date=?, units=? WHERE id=? `
const deleteQuery = `DELETE FROM ${tableName} WHERE ${tableName}.id=`
const deleteTableQuery = `DROP TABLE IF EXISTS ${tableName}`
const createTableQuery = `CREATE TABLE ${tableName}(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    reps INT,
    weight INT,
    units VARCHAR(255) NOT NULL,
    date DATE
)`

// pool.query(deleteTableQuery, function(err) {
//     pool.query(createTableQuery, function(err) {
//         if (err) {
//             console.log(err);
//         }
//         console.log('Exercise table created')
//     })
// })

// Gets all rows from table in SQL
app.get('/', (req, res) => {
    pool.query(getAllQuery, (err, rows) => {
        if (!err) {
            res.send(JSON.stringify(rows));
        } else {
            console.log(err);
        }
    })
})

// Insert new exercise
app.post('/', (req, res) => {
    let inputValues = "'" + req.body.name + "'," + req.body.reps + "," + req.body.weight + ",'" + req.body.units + "','" + req.body.date + "'";
    pool.query(insertQuery + inputValues + ");", (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        res.send(JSON.stringify(rows));
    })
})

app.put('/', (req, res) => {
    pool.query(updateQuery, [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.units, req.query.id], (err) => {
        if (err) {
            console.log(err);
            return;
        }
        res.send('home');
    })
})

app.delete('/', (req, res, next) => {
    pool.query(deleteQuery + req.body.id, function(err, rows) {
        if (err) {
            next(err);
            return;
        }
        res.send(JSON.stringify(rows));
    })
})

// Resets entire table
app.get('/reset-table', (req, res, next) => {
    pool.query(deleteTableQuery, (err) => {
        pool.query(createTableQuery, (err) => {
            res.send(`${tableName} table reset`)
        })
    })
})

app.use((req, res) => {
    res.status(404);
    res.send('Error 404 - Page does not exist')
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.send('Error 500');
})

app.listen(app.get('port'), () => {
    console.log('Express started on port ' + app.get('port') + '; Ctrl+C to terminate')
})

