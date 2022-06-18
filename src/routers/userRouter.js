const express = require('express');
const User = require('../models/user');
const { auth } = require('../auth/auth');
const {isItAuth} = require('../auth/auth');

const router = new express.Router({strict: true});

// creating a user (this variable will come directly from the auth0 API)
router.post('/', isItAuth, async (req, res)=>{
   try {
      const user = new User({...req.body});
      await user.save();
      res.status(201).send(user);
   } catch(e){
      res.status(400).send({error: e.message});
   }
});
// getting a user (prov)
router.get('/:id', auth, async(req, res)=>{
   try{
      const user = await User.findOne({_id: req.query.id}, {email: 0});
      if(!user) throw new Error('user not found');
      res.send(user)
   }catch(e){
      res.status(404).send({error: e.message});
   }
});

// updating a user ( this request come from client and shoud send a request to auth0 API)
router.patch('/:id', auth, async (req, res)=>{
   try{
      // if the owner of the acc is responsible for update
      if(req.user._id != req.params.id) throw new Error('access denied');
      /******                      *
       * send request to auth0 API *
       *                       *****/
      if(/*Request fulfilled*/ true){ // aplying updates in local db 
            updates.forEach( update => req.user[update] = req.body[update]);
         await req.user.save();
      }
      res.status(200).send(req.user);
   } catch(e){
      res.status(401).send({error: e.message});
   }
});
// deleting user ( this needs to send request to auth0 API)
router.delete('/:id', auth, async(req, res)=>{
   try{
      // if the owner of the acc is responsible for update
      if(req.user._id != req.params.id) throw new Error('access denied');
      /******                      *
       * send request to auth0 API *
       *                       *****/
      if(/* request fulfilled */ true){
         await req.user.remove();
         res.send({res: 'user deleted successfully.'});
      }
      res.status(200).send(/**user**/)
   } catch(e){
      res.status(401).send({error: e.message});
   }
});

module.exports = router;