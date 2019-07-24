const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Item = require("../../src/models/item");

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();
const userOne = {
  name: "Marko Popovic",
  email: "marko.vlasotince@hotmail.com",
  password: "asd12321!",
  _id: userOneId,
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
};

const userTwo = {
  name: "Pera peric",
  email: "marko.perijevic@hotmail.com",
  password: "1235678!",
  _id: userTwoId,
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
};

const itemOneId = new mongoose.Types.ObjectId();
const itemTwoId = new mongoose.Types.ObjectId();
const itemThreeId = new mongoose.Types.ObjectId();
const itemFourId = new mongoose.Types.ObjectId();
const itemOne = {
  _id: itemOneId,
  itemName: "A-itemOne - UserOne",
  price: 370,
  hashtag: "food",
  owner: userOne._id
};

const itemTwo = {
  _id: itemTwoId,
  itemName: "B-ItemTwo - UserOne",
  price: 320,
  hashtag: "food",
  owner: userOne._id
};

const itemFour = {
  _id: itemFourId,
  itemName: "A-ItemThree - UserOne",
  price: 390,
  hashtag: "drinks",
  owner: userOne._id
};

const itemThree = {
  _id: itemThreeId,
  itemName: "ItemThree - UserTwo",
  price: 390,
  hashtag: "pasta",
  owner: userTwo._id
};

const setupDatabaseUsers = async () => {
  await Item.deleteMany();
  await User.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
};

const setupDatabaseItems = async () => {
  await Item.deleteMany();
  await User.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Item(itemOne).save();
  await new Item(itemTwo).save();
  await new Item(itemThree).save();
  await new Item(itemFour).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  itemOne,
  itemTwo,
  itemThree,
  itemOneId,
  itemTwoId,
  itemThreeId,
  itemFour,
  itemFourId,
  setupDatabaseUsers,
  setupDatabaseItems
};
