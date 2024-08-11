//app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const {dbConnect} = require('./config/mongo');
const PORT = process.env.PORT || 3000;

dbConnect();

app.use(cors());
app.use(express.json())
app.use('/api/', require('./app/routes'))

app.listen(PORT, ()=>{
    console.log('La api esta lista...')
})