const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeMessage, sendLeavingMessage } = require("../emails/account");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateToken();
    await user.save();
    sendWelcomeMessage(user.email, user.name);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// router.get("/users/:id", auth, async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const user = await User.findById(_id);
//     if (!user) return res.status(404).send();
//     res.status(200).send(user);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid property for updating" });

  try {
    updates.forEach(update => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendLeavingMessage(req.user.email, req.user.name);
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
