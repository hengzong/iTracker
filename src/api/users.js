import Bookmarkshema from '../models/bookmark';
import User from '../models/user';
import express from 'express';
import mongoose from 'mongoose';
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var time = 3600; //1 hour

router.post('/register', (req, res)=>{
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  var params = {
    name:req.body.name,
    email:req.body.email,
    password:hashedPassword
  }
  var new_user = User.create(params, function(err, user){
    if(err){
      console.log(err);
      return res.status(500).send({
        message: "error: name, email, password required or duplicated email",
        data: [],
      });
    }else{
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: time
      });
      return res.status(201).send({
        message: "OK",
        data: {
          user: { _id: user._id, name: user.name },
          auth: true,
          token
        }
      })
    }
  });
});

router.post('/login', (req, res)=>{
  console.log(req.body.email);
  User.findOne({email:req.body.email}, (err, user)=>{
    if (err) {
      return res.status(500).send({
        message: "server error",
        data:  { auth: false, token: null }
      });
    }
    if (!user) {
      return res.status(404).send({
        message: "invalid user",
        data:  { auth: false, token: null }
      });
    }
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Error: wrong password",
        data:  { auth: false, token: null }
      });
    }
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: time
    });
    res.status(200).send({
      message: "OK",
      data:{
        user: { _id: user._id, name: user.name },
        auth: true,
        token
      }
    });
  });
});

router.delete("/:id", (req, res) => {
  var token = req.body.token;
    try{
      var legit = jwt.verify(token, config.secret);
    }
    catch(err){
      console.log("token expired or invalid");
      return res.status(400).send({
          message: "Token expired or invalid",
          data: err
        });
    }
  var user_name;
  var user = User.findByIdAndRemove(req.params.id);
  user.exec((err, user)=>{
    if (err){
      return res.status(500).json({
        message: "Server Error",
        data: []
      })
    }
    if (user == null){
      return res.status(404).json({
        message: "Invalid user",
        data: []
      })
    }else{
      console.log(user);
      user_name = user.name;
    }
  });

  user.then((err,user)=>{
    Bookmarkshema.deleteMany({assignedUser:req.params.id}, (err, bookmark)=>{
      if (err){
        return res.status(500).json({
          message: "Server Error",
          data: []
        });
      }
      else{
        return res.status(200).json({
          message: "This user has been deleted successfully",
          data: {
            user: { _id: req.params.id, name: user_name}
          }
        });
      }
    });
  }).catch(err=>{
    console.log(err);
  })
});





module.exports = router;
