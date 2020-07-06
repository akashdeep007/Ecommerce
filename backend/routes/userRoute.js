import express from "express";
const bcrypt = require("bcryptjs");
import User from "../models/userModel";
import { getToken } from "../util";
const { body, validationResult } = require("express-validator");

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
        isUser: signinUser.isUser,
        token: getToken(signinUser),
      });
    } else {
      res.status(401).send({ msg: "Wrong Password" });
    }
  } else {
    res.status(401).send({ msg: "Invalid Email" });
  }
});

router.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("Name Cannot be Empty").trim(),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email Cannot be Empty")
      .isEmail()
      .withMessage("Not a Email")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((UserDoc) => {
          if (UserDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      }),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password Cannot be Empty")
      .isLength({ min: 8, max: 32 })
      .withMessage("Password Length should be between 8 and 32 characters")
      .not()
      .isIn([
        "123",
        "password",
        "god",
        "12345678",
        "qwerty",
        "nothing",
        "secret",
        "admin",
        "iloveyou",
        "11111111",
      ])
      .withMessage("Do not use a common word as the password")
      .trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() });
    }
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
        isUser: newUser.isUser,
        token: getToken(newUser),
      });
    } else {
      res.status(401).send({ message: "Invalid User Data." });
    }
  }
);

router.get("/createUser", async (req, res) => {
  try {
    const user = new User({
      name: "Satyaki",
      email: "sat@ki.com",
      password: "12345",
      isUser: true,
    });

    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({ msg: error.message });
  }
});

export default router;
