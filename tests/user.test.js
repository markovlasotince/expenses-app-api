const request = require("supertest");
const app = require("../src/app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../src/models/user");

const { userOneId, userOne, setupDatabaseUsers } = require("./fixtures/db");

beforeEach(setupDatabaseUsers);
// afterEach(() => {});

test("Should signup new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Marko",
      email: "markovlasotince123@gmail.com",
      password: "asd12321!"
    })
    .expect(201);

  // See if user is acctually in DB
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  // expect(response.body.user.name).toBe('Marko')
  expect(response.body).toMatchObject({
    user: {
      name: "Marko",
      email: "markovlasotince123@gmail.com"
    },
    token: user.tokens[0].token
  });
  expect(user.password).not.toBe("asd12321!");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "badpassword"
    })
    .expect(400);
});

test("Should get users profile", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should NOT get users profile for unauthenticated user", async () => {
  await request(app)
    .get("/users/me")
    .send()
    .expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should NOT delete account for unauthenticated user", async () => {
  await request(app)
    .delete("/users/me")
    .send()
    .expect(401);
});

test("Should update valid user fiels", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Perica"
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.name).toBe("Perica");
});

test("Should not update invalid user fiels", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Paris"
    })
    .expect(400);
});
