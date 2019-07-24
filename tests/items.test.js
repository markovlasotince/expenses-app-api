const request = require("supertest");
const app = require("../src/app");
const Item = require("../src/models/item");
const {
  userOneId,
  userOne,
  setupDatabaseItems,
  userTwo,
  itemFour,
  itemFourId,
  itemThree
} = require("./fixtures/db");

beforeEach(setupDatabaseItems);

test("Should add item for user", async () => {
  const response = await request(app)
    .post("/items")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      itemName: "Novi",
      price: "50",
      hashtag: "other",
      owner: userOneId
    })
    .expect(201);

  const item = await Item.findById(response.body._id);
  expect(item.body).not.toBeNull();
});

test("Get all items for userOne", async () => {
  const response = await request(app)
    .get("/items")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const items = await Item.find({ owner: userOneId });
  expect(response.body.length).toBe(items.length);
});

test("Get item with price 320 from userOne", async () => {
  const response = await request(app)
    .get("/items?price=320")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body[0].price).toBe(320);
  expect(response.body[0].itemName).toBe("B-ItemTwo - UserOne");
});

test("Get item/s with price greater than 350 from userOne", async () => {
  const response = await request(app)
    .get("/items?price=>350")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body).not.toBeNull();
  expect(response.body.length).toBe(2);
});

test("Get item/s sorted by name DESC from userOne", async () => {
  const response = await request(app)
    .get("/items?sortBy=itemName_desc")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body).not.toBeNull();
  expect(response.body.length).toBe(3);
  expect(response.body[0].itemName).toBe("B-ItemTwo - UserOne");
});

test("Get item/s with hashtag drinks from userOne", async () => {
  const response = await request(app)
    .get("/items?hashtag=drinks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body).not.toBeNull();
  expect(response.body.length).toBe(1);
  const item = await Item.findById(itemFourId);
  expect(response.body[0]._id.toString()).toBe(item._id.toString());
});

test("Delete items security", async () => {
  await request(app)
    .delete(`/items/${itemThree._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404);

  const item = await Item.findById(itemThree._id);
  expect(item).not.toBeNull();
});
