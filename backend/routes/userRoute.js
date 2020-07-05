import express from "express";
const bcrypt = require("bcryptjs");
import User from "../models/userModel";
import { getToken } from "../util";

const router = express.Router();

router.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const signinUser = await User.findOne({
    email: email,
  });
  if (signinUser) {
    const passisequal = await bcrypt.compare(password, signinUser.password);
    // console.log(passisequal);
    if (passisequal) {
      res.send({
        _id: signinUser.id,
        name: signinUser.name,
        email: signinUser.email,
        isAdmin: signinUser.isAdmin,
        token: getToken(signinUser),
      });
    } else {
      res.status(401).send({ msg: "Wrong Password" });
    }
  } else {
    res.status(401).send({ msg: "Invalid Email" });
  }
});

router.post("/register", async (req, res) => {
  const password = req.body.password;
  const hashedPw = await bcrypt.hash(password, 12);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPw,
  });
  const newUser = await user.save();
  if (newUser) {
    res.send({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: getToken(newUser),
    });
  } else {
    res.status(401).send({ message: "Invalid User Data." });
  }
});

router.get("/createadmin", async (req, res) => {
  try {
    const user = new User({
      name: "Satyaki",
      email: "sat@ki.com",
      password: "12345",
      isAdmin: true,
    });

    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({ msg: error.message });
  }
});

export default router;
