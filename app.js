import path from 'path';


import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';

import http from 'http';

import { Server } from 'socket.io';

import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

// import users from './Users.js';
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// main public folder
const url = new URL(import.meta.url);
const __dirname = path.join(url.pathname, 'public')
console.log(__dirname);
app.use(express.static('public'));

// background images.
app.use('/bg', express.static('public/lib/components/main-background/src'));

// Auth Registration QR Codes
app.use('/qr', express.static('public/img/qr'));




// app.use('/users', users);

const server = http.createServer(app);
const io = new Server(server);


server.listen(PORT, function() {
  console.log(`server running on port ${PORT}...`);
});



import PostgresDB from '@ofeenee/postgresdb';
const Postgres = new PostgresDB();
const users = new Postgres();

import RedisDB from '@ofeenee/redis';
const Redis = new RedisDB();

import User from '@ofeenee/user';

import {Email, Phone, ID} from '@ofeenee/user';
let POPULATION = 0;
// socket.io events
///////////////////

io.on('connection', function (socket) {
  try {
    console.log('a user connected');

    ++POPULATION;

    socket.broadcast.emit('birth', POPULATION);
    socket.emit('birth', POPULATION);
    socket.emit('welcome', 'Welcome.');

    // EMAIL LISTENERS
    socket.on('set-email', async (value) =>{
      try {
        const email = new Email(value);
        const user = await users.getByEmail(email.get());
        console.log('user', user);
        if (user) {
         return socket.emit('member', JSON.stringify(user.info()));
        }
        else {
          const verified = await Redis.get(email.get());
          console.log('verified:', verified);
          if (verified === 'true') {
            return socket.emit('verified-email', email.get());
          }
          else {
            Redis.set(email.get(), 'false');
            return socket.emit('unverified-valid-email', email.get());
          }
        }
      }
      catch (error) {
        socket.emit('error', error.message);
      }
    });

    socket.on('send-email-verification-code', async (data) => {
      try {
        data = JSON.parse(data);
        const email = new Email(data.value);
        const response = await email.verification.sendCode();
        socket.emit('email-verification-code-sent', JSON.stringify(response));
      }
      catch (error) {
        socket.emit('error', error.message);
      }
    });

    socket.on('verify-email-address', async (data) => {
      try {
        data = JSON.parse(data);
        const email = new Email(data.value);
        const response = await email.verification.confirmCode(data.code);
        if (response.status === 'approved') {
          Redis.set(email.get(), 'true');
          socket.emit('email-address-verified', email.get());
        }
        else {
          throw new Error('verification code invalid.');
        }
      }
      catch (error) {
        socket.emit('error', error.message);
      }
    });
    // PHONE LISTENERS
    socket.on('set-phone', async (value) =>{
      try {
        const phone = new Phone(value);
        const user = await users.getByPhone(phone.get());
        console.log('user', user);
        if (user) {
         return socket.emit('member', JSON.stringify(user.info()));
        }
        else {
          const verified = await Redis.get(phone.get());
          console.log('verified:', verified);
          if (verified === 'true') {
            return socket.emit('verified-phone', phone.get());
          }
          else {
            Redis.set(phone.get(), 'false');
            return socket.emit('unverified-valid-phone', phone.get());
          }
        }
      }
      catch (error) {
        socket.emit('error', error.message);
      }
    });

    socket.on('send-phone-verification-code-sms', async (data) => {
      try {
        data = JSON.parse(data);
        const phone = new Phone(data.value);
        const response = await phone.verification.sendCodeSMS();
        socket.emit('phone-verification-code-sent', JSON.stringify(response));
      }
      catch (error) {
        socket.emit('error', error.message);
      }
    });
    socket.on('send-phone-verification-code-call', async (data) => {
      try {
        data = JSON.parse(data);
        const phone = new Phone(data.value);
        const response = await phone.verification.sendCodeCall();
        socket.emit('phone-verification-code-sent', JSON.stringify(response));
      }
      catch (error) {
        socket.emit('error', error.message);
      }
    });

    socket.on('verify-phone-number', async (data) => {
      try {
        data = JSON.parse(data);
        const phone = new Phone(data.value);
        const response = await phone.verification.confirmCode(data.code);
        if (response.status === 'approved') {
          Redis.set(phone.get(), 'true');
          socket.emit('phone-number-verified', phone.get());
        }
        else {
          throw new Error('verification code invalid.');
        }
      }
      catch (error) {
        socket.emit('error', error.message);
      }
    });

    socket.on('register-user', async (data) => {
      try {
        console.log(JSON.parse(data));
        const user = new User(JSON.parse(data));
        console.log(user);

        socket.emit('user-registered', JSON.stringify(user.info()));
      }
      catch(error) {
        socket.emit('error', error.message);
      }
    });

    socket.on('disconnect', function () {
      console.log('user disconnected');
      --POPULATION;
      socket.emit('death', POPULATION)
      socket.broadcast.emit('death', POPULATION);
    });

  }
  catch (error) {
    throw error;
  }
});