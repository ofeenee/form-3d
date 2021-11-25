import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';


import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

import users from './Users.js';
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// main public folder
app.use(express.static('public'));

// background images.
app.use('/bg', express.static('public/lib/components/main-background/src'));


app.use('/users', users);

app.listen(PORT, function() {
  console.log(`server running on port ${PORT}...`);
});