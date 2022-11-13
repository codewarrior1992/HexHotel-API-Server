const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();

// Middle Ware
app.use(express.json());
app.use(cors())

// Require Route 
const user = require('./routes/user.js');
const room = require('./routes/room.js');
const order = require('./routes/order.js');
const newebpay = require('./routes/newebpay.js');

app.use('/user', user);
app.use('/room', room);
app.use('/order', order);
app.use('/newebpay', newebpay);

// 參數要參考官網(隨時變動)
mongoose.connect(process.env.DB, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
}).then(()=>{
    app.listen(port,()=>{
        console.log('Is listening 3000 port now')
    })
})

