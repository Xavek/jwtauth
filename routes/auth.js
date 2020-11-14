const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middlewares/authenticate");
require("dotenv").config();

router.route("/register").post((req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPass) => {
    if (err) {
      res.json(err);
    }

    let user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPass,
    });

    user
      .save()
      .then(() => res.json("User Saved"))
      .catch((err) => res.json(err));
  });
});

router.route("/login").post((req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ $or: [{ email: username }, { phone: username }] }).then(
    (user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            res.json(err);
          }
          if (result) {
            let token = jwt.sign({ name: user.name }, process.env.Secret_KEY, {
              expiresIn: "1h",
            });
            res.json({
              msg: "login Sucessfull",
              token,
            });
          } else {
            res.json({
              msg: "Password doesnot matched",
            });
          }
        });
      } else {
        res.json("No user found");
      }
    }
  );
});

router.get("/allusers", authenticate, (req, res) => {
  User.find()
    .then((response) => res.json(response))
    .catch((err) => console.log(err));
});

module.exports = router;
