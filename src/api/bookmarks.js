import Bookmarkshema from "../models/bookmark";
import express from "express";
import mongoose from "mongoose";
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var router = express.Router();

router.get("/", function(req, res) {
  var token = req.query.token;

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

  Bookmarkshema.find({ assignedUser: req.query.userID }).exec(function(
    err,
    bookmarklist
  ) {
    if (err) {
      return res.status(500).send({
        message: "GET request failed",
        data: []
      });
    } else if (bookmarklist !== null && bookmarklist !== []) {
      return res.status(200).send({
        message: "OK",
        data: bookmarklist
      });
    } else {
      return res.status(404).send({
        message: "Not found",
        data: []
      });
    }
  });
});

router.get("/:id", (req, res) => {
  var token = req.query.token;
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

  var ret = Bookmarkshema.findById(req.params.id);
  Bookmarkshema.findById(req.params.id).exec(function(err, bookmarklist) {
    if (err) {
      return res.status(500).send({
        message: "GET request failed",
        data: []
      });
    } else if (bookmarklist !== null && bookmarklist !== []) {
      return res.status(200).send({
        message: "OK",
        data: bookmarklist
      });
    } else {
      return res.status(404).send({
        message: "Not found",
        data: []
      });
    }
  });
});

router.post("/", function(req, res) {
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
  

  Bookmarkshema.find({ assignedUser: req.body.assignedUser }).exec(function(
    err,
    bookmarklist
  ) {
    if (err) {
      return res.status(500).send({
        message: "POST request failed",
        data: []
      });
    } else if (bookmarklist !== null && bookmarklist !== []) {
      for (var i = 0; i < bookmarklist.length; i++) {
        if (req.body.name == bookmarklist[i].name) {
          return res.status(400).send({
            message: "Duplicated folder names",
            data: []
          });
        }
      }

      let newBookmark = {
        name: req.body.name,
        urlList: req.body.urlList,
        assignedUser: req.body.assignedUser
      };

      Bookmarkshema.create(newBookmark, function(err, Bookmark) {
        if (err) {
          return res.status(500).send({
            message: "POST request failed",
            data: []
          });
        } else {
          return res.status(201).send({
            message: "OK",
            data: Bookmark
          });
        }
      });
    }
  });
});

router.put("/:id", (req, res) => {
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
  

  Bookmarkshema.findById(req.params.id).exec((err, bookmark) => {
    if (err) {
      return res.status(500).send({
        message: "Server Error",
        data: []
      });
    } else if (bookmark == null) {
      return res.status(404).send({
        message: "This folder is not found",
        data: []
      });
    } else {
      if (req.body.name) {
        Bookmarkshema.find({
          assignedUser: bookmark.assignedUser,
          _id: { $ne: req.params.id }
        }).exec(function(err, bookmarklist) {
          if (err) {
            return res.status(500).send({
              message: "PUT request failed",
              data: []
            });
          } else if (bookmarklist !== null && bookmarklist !== []) {
            for (var i = 0; i < bookmarklist.length; i++) {
              if (req.body.name == bookmarklist[i].name) {
                return res.status(400).send({
                  message: "Duplicated folder names",
                  data: []
                });
              }
            }

            bookmark.name = req.body.name || bookmark.name;
            bookmark.urlList = req.body.urlList;

            bookmark.save();
            return res.status(200).send({
              message: "This folder has been successfully updated",
              data: bookmark
            });
          }
        });
      }
    }
  });
});

router.delete("/:id", (req, res) => {
  var token = req.query.token;

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
  
  var ret = Bookmarkshema.findByIdAndRemove(req.params.id);
  ret.exec((err, bookmark) => {
    if (err) {
      return res.status(500).send({
        message: "Server Error",
        data: []
      });
    } else if (bookmark == null) {
      return res.status(404).send({
        message: "This folder is not found",
        data: []
      });
    }
    return res.status(200).send({
      message: "This folder has been deleted successfully",
      data: bookmark
    });
  });
});

module.exports = router;
