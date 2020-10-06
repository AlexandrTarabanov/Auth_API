const express = require("express")
const path = require("path")
const mysql = require("mysql")
const dotenv = require("dotenv")
const cookieParser = require('cookie-parser')

const app = express()

dotenv.config({
    path: './.env'
})

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log('MYSQL: OK')
    }
})
const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))


//Parse
app.use(express.urlencoded({extendet: false}))
app.use(express.json())
app.use(cookieParser())

app.set('view engine', 'hbs')

//Routes
app.use('/', require('./routes/routes'))
app.use('/auth', require('./routes/auth'))


app.get('/', (req, res) => {
    db.query('SELECT name, login FROM user', (err, results) => {
        if (err) {
            return console.log(err)
        } else {
            res.render('index', {
                users: results
            })
        }
    })
})

app.listen(5000, () => {
    console.log('server: OK')
})