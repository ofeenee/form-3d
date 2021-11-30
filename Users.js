

import JWT from '@ofeenee/jwt';
const ACCESS = new JWT({expiration: '5m', encrypted: true, issuer: 'colliverde.com'});
const REFRESH = new JWT({issuer: 'colliverde.com', audience : 'developer', path: '.refresh'})

import PostgresDB from '@ofeenee/postgresdb';
const Postgres  = new PostgresDB();


// import Redis from '../../Classes/Redis/Redis.js';
import Redis from '@ofeenee/redis';
const redis = new Redis({
  db: 0
});
console.log('redis db cleared:', await redis.deleteAll());

import User from '@ofeenee/user';
import {Phone, Email} from '@ofeenee/user';


import express from 'express';
const Users = express.Router();
Users.use(express.json());
Users.use(express.urlencoded({extended: true}));





Users.get('/validate/email/:email', loadUserByEmail, checkUserEmailVerification, async function(req, res) {
  try {
    const email = req.params.email;
    return res.status(200).json({ email: email.get(), valid: true });
   }
  catch (error) {
    return res.status(500).json({error: error.message});
  }
});


Users.get('/validate/phone/:phone', loadUserByEmail, async function(req, res) {
  try {
    const phone = new Phone(req.params.phone);
    return res.status(200).json({ phone: phone.get(), valid: true});
  }
  catch (error) {
    return res.status(500).json({error: error.message});
  }
});

Users.get('/verification/email/send/:email/', async function(req, res) {
  try {
    const email = new Email(req.params.email);

    const response = await email.verification.sendCode();
    res.status(200).json({email, status: response.status});
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

Users.get('/verification/email/verify/:email/:code/', async function(req, res) {
  try {
    const email = new Email(req.params.email);

    const response = await email.verification.confirmCode(req.params.code);
    res.status(200).json({email, status: `${email.get()}: ${response.status === 'approved' ? 'approved' : 'verification failed.'}`});
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

Users.get('/verification/phone/verify/:phone/:code/', async function(req, res) {
  try {
    const phone = new Phone(req.params.phone);

    const response = await phone.verification.confirmCode(req.params.code);
    res.status(200).json({phone, status: `${phone.get()}: ${response.status === 'approved' ? 'approved' : 'verification failed.'}`});
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

Users.get('/verification/phone/send/sms/:phone', async function(req, res) {
  try {
    const phone = new Phone(req.params.phone);

    const response = await phone.verification.sendCodeSMS();
    res.status(200).json({phone, status: `code sent via SMS: ${response.status}`});
  }
  catch (error) {
    return res.status(500).json({error: error.message});
  }
});

Users.get('/verification/phone/send/call/:phone/', async function(req, res) {
  try {
    const phone = new Phone(phone);

    const response = await phone.verification.sendCodeCall();
    res.status(200).json({ phone, status: `code sent via phone call: ${response.status}`});
  }
  catch (error) {
    return res.status(500).json({error: error.message});
  }
});



export default Users;


//
//
// middleware

async function loadUserByEmail(req, res, next) {
  try {
    const {email} = req.body;
    if (!User.validate.email(email)) throw new Error('email address invalid');


    const postgres = new Postgres();
    const response = await postgres.getByEmail(email);

    if (response) {
      req.user = new User(response, true);
      return next();
    }
    else {
      req.user = new User({email}, false);
      return next();
    }
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({error: error.message});
  }
}

async function checkUserEmailVerification(req, res, next) {
  try {
    const {user} = req;
    if (user.returning) return next();

    const emailPrefix = 'email:';
    const phonePrefix = 'phone:';
    const codePrefix = 'code:';


    const state = await redis.get(emailPrefix + user.email.get());
    if (state === null) await redis.set(emailPrefix + user.email.get(), 'false');
    console.log('verification process - email:', user.email.get(), state);
    req.user.verified = state;
    next();

  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
}