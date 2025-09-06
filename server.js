
const express = require('express');
const mongodb = require('./data/database');
const app = express();


app.use('/', require('./routes'));
const port = 3000
app.listen(process.env.port || port)


mongodb.iniDb((err) => {
    if (err){
        console.log(err)
    }
    else{
        console.log('Database is listening and node runing on port ' + (process.env.port || port));
    }
});

