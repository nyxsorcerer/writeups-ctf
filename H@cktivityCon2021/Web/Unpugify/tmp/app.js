const express = require('express')
const app = express()
app.set('view engine', 'pug')
app.get('/', function (req, res) {
    res.render('index', { pretty: req.query.p })
})
app.listen(6000)