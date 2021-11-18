import JWT from '@ofeenee/jwt';
const ACCESS = new JWT({expiration: '5m', encrypted: true, issuer: 'x4.ngrok.io'});
const REFRESH = new JWT({issuer: 'server', audience : 'developer', path: '.refresh'})

import PostgresDB from '@ofeenee/postgresdb';
const Postgres  = new PostgresDB();

import Redis from '@ofeenee/redis';
// import Redis from '../../Classes/Redis/Redis.js';
import User from '@ofeenee/user';

import express from 'express';

const Users = express.Router();
Users.use(express.json());
Users.use(express.urlencoded({extended: true}));

const redis = new Redis({
  db: 0
});

console.log(await redis.deleteAll());

const emailPrefix = 'email:';
const phonePrefix = 'phone:';
const codePrefix = 'code:';

Users.post('/get/email', loadUserByEmail, checkUserEmailVerification, async function(req, res) {
  try {
    const { user } = req;
    return res.status(200).json({ returning: user.returning, verified: user.verified});
    // TODO
    // if existing do this
    // if new do that
  }
  catch (error) {
    // console.log(error);
    return res.status(500).json({error: error.message});
  }
});


Users.post('/send/code/email', loadUserByEmail, async function(req, res) {
  try {
    const { user } = req;
    if (user?.returning) {
      // do this
    }
    else {
      // do that
    }
    const codeRequested = await redis.exists(codePrefix + user.email.get());
    if (codeRequested?.exists) {
      return res.status(200).json(codeRequested);
    }


    const verified = await redis.get(emailPrefix + user.email.get());
    console.log('/send/code/email:', user.email.get(), verified);

    if (verified === 'verified') return res.status(200).json({email: user.email.get(), verified: 'true'});



    const verification = await user.email.verification.sendCode(req.body.email);
    const newCodeRequest = await redis.set(codePrefix + user.email.get(), 'sent', 60);

    return res.status(200).json({verification, codeRequest: newCodeRequest});

  }
  catch (error) {
    console.log(error);
    return res.status(500).json({error: error.message});
  }
});

Users.post('/verify/code/email', async function(req, res) {
  try {
    const user = new User(req.body);

    const verified = await redis.get(emailPrefix + user.email.get());
    console.log('/verify/code/email:', user.email.get(), verified);

    if (verified === 'true') return res.status(200).json({ email: user.email.get(), verified });

    const verification = await user.email.verification.confirmCode(req.body.code);
    if (verification.status === 'approved') {
      const verified = await redis.put(emailPrefix + user.email.get(), 'true');

      const codeRequested = await redis.del(codePrefix + user.email.get());
      console.log('delete code request from redis...', codeRequested);

      return res.status(200).json({email: user.email.get(), verified: 'true', redis: verified});
    }

    return res.status(401).json({email: user.email.get(), error: 'code invalid.'});

  }
  catch (error) {
    return res.status(500).json({error: error.message});
  }
});

Users.post('/get/phone', async function (req, res) {
  try {
    const user = new User(req.body);

    const postgres = new Postgres();
    const response = await postgres.getByPhone(user.phone.get());

    if (response) {
      return res.status(200).json({ status: 'returning user', existing: true });
    }
    else {

      const state = await redis.get(phonePrefix + user.email.get());
      console.log('/get:', user.email.get(), state);

      if (state != 'null') await redis.set(phonePrefix + user.email.get(), 'unverified');
      return res.status(200).json({ status: 'new user', existing: false, verified: state || false });
    }
  }
  catch (error) {
    // console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

Users.post('/send/code/phone/:channel', async function(req, res) {
  try {
    const user = new User(req.body);

    const codeRequested = await redis.exists(codePrefix + user.phone.get());
    if (codeRequested?.exists) {
      return res.status(200).json(codeRequested);
    }


    const verified = await redis.get(phonePrefix + user.phone.get());
    console.log('/send/code/phone:', user.phone.get(), verified);

    if (verified === 'verified') return res.status(200).json({phone: user.phone.get(), verified});



    const verification = await user.phone.verification.sendCode(req.body.phone);
    const newCodeRequest = await redis.set(codePrefix + user.phone.get(), 'sent', 60);

    return res.status(200).json({verification, codeRequest: newCodeRequest});

  }
  catch (error) {
    console.log(error);
    return res.status(500).json({error: error.message});
  }
});

Users.post('/verify/code/phone/:channel', async function(req, res) {
  try {
    const user = new User(req.body);


    console.log('channel:', req.params);

    const verified = await redis.get(phonePrefix + user.phone.get());
    console.log('/verify/code/phone:', user.phone.get(), verified);

    if (verified === 'verified') return res.status(200).json({ phone: user.phone.get(), verified });

    const verification = await user.phone.verification.confirmCode(req.body.code);
    if (verification.status === 'approved') {
      const verified = await redis.put(phonePrefix + user.phone.get(), 'verified');

      const codeRequested = await redis.del(codePrefix + user.phone.get());
      console.log('delete code request from redis...', codeRequested);

      return res.status(200).json({phone: user.phone.get(), verified: true, redis: verified});
    }

    return res.status(401).json({phone: user.phone.get(), error: 'code invalid.'});

  }
  catch (error) {
    return res.status(500).json({error: error.message});
  }
});

Users.post('/send/code/phone', async function(req, res) {
  try {
    const user = new User(req.body);


    const verification = await user.phone.verification.sendCodeSMS(req.body.phone);

    return res.status(200).json(verification);

  }
  catch (error) {
    return res.status(500).json({error: error.message});
  }
});

Users.post('/verify/code/phone', async function(req, res) {
  try {
    const user = new User(req.body);


    const verification = await user.phone.verification.confirmCode(req.body.code);
    if (verification.status === 'approved') {

    }

    return res.status(200).json(verification.status);

  }
  catch (error) {
    return res.status(500).json({error: error.message});
  }
});

Users.post('/registration', async function(req, res) {
  try {
    const user = new User(req.body);

    console.log(req.body);
    console.log(user.info());

    return res.status(200).json(user.info());

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