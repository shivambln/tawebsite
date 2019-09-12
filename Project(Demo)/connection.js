const mongoose = require('mongoose');
mongoose.connect('mongodb://13.71.4.60:27017/RESTproject', { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('Cannot connect database to node');
        console.log(err);
    } else {
        console.log('Database connection successful.');
    }
});

require('./schema');