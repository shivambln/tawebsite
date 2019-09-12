require('./connection');
const express = require('express');
const controller = require('./controller');
const bodyparser = require('body-parser');
const app = express();

app.use(bodyparser.json({limit:'50mb'}));
app.use(bodyparser.urlencoded({extended:true,limit:'50mb'}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*",{limit:'50mb'});
    next();
});

app.listen(3000,(err)=>{
    if (err) {
        console.log('Server not started:');
    } else {
        console.log('server started at port 3000.');
    }
});

app.use('/',controller);
