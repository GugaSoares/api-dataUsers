const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json')
const crypto = require('crypto');

const User = require('../../models/user');
const { notDeepEqual } = require('assert');

const router = express.Router();

function generateToken(params= {}){
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
});
}

router.post('/register', async(req, res)=> {
  const {email} = req.body;
  try {
    if (await User.findOne({email}))
    return res.status(400).send({error: 'User already exist'});

    user.password = undefined;

    const user = await User.create(req.body);
    return res.send({
      user,
      token: generateToken({id: user.id}),
    });
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed' });
  }
});

router.post('/authenticate', async (req , res)=>{
  const {email, password} = req.body;
  const user = await User.findOne({email}).select('+password');
  
  if (!user)
  return res.status(400).send({error: 'User not found'});

  if (!await bcrypt.compare(password, user.password))
  return res.status(400).send({error: 'Invalid password'})
  
  user.password = undefined; 

  res.send({
    user,
    token: generateToken({id: user.id}),
  });
});

router.post('/forgot_password', async (req, res)=> {
  const {email} = req.body;
  
  try {
    const user = await User.findOne({email});
    
    if (!user){
      return res.status(400).send({error: 'User not found'});

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(user.id, {
        '$set': {
          passwordResetToken: token,
          passwordResetExpires: now,
        }
      })
    }
    console.log(token, now);
  } catch (err){
    res.status(400).send({error: 'Fail to recover password, try again'})
  }
})

module.exports = app => app.use('/auth', router);
