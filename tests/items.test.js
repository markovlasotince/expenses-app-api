const request = require("supertest");
const app = require("../src/app");
const Item = require("../src/models/item");
const {
  userOneId,
  userOne,
  setupDatabaseItems,
  userTwo,
  itemThreeId,
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
  expect(response.body.length).toBe(2);
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
