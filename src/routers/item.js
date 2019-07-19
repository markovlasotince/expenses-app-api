const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const auth = require("../middleware/auth");

router.post("/items", auth, async (req, res) => {
  const item = new Item({
    ...req.body,
    owner: req.user._id
  });
  try {
    await item.save();
    res.status(201).send(item);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /items?price=370
// GET /items?limit=10&skip=0 || skip=10 to je druga strana
// GET /items?sortBy=createdAt_asc -> 1 || /items?sortBy=createdAt_desc -> -1
// GET /items?price=>VALUE || /items?price=<VALUE
router.get("/items", auth, async (req, res) => {
  const match = {};
  const options = {};
  const allowedParams = [
    "price",
    "itemName",
    "hashtag",
    "createdAt",
    "updatedAt",
    "sortBy",
    "filter",
    "limit"
  ];
  const queryParams = [];
  try {
    for (keys in req.query) {
      if (allowedParams.includes(keys)) {
        queryParams.push(keys);
      } else {
        throw new Error("Bad query parameters");
      }
    }

    // for (let i = 0; i < queryParams.length; i++) {
    //   if (queryParams[i] === "limit" || queryParams[i] === "skip") {
    //     options[queryParams[i]] = parseInt(req.query[queryParams[i]]);
    //   } else {
    //     if (queryParams[i] !== "sortBy" && queryParams[i] !== "filter") {
    //       match[queryParams[i]] = req.query[queryParams[i]];
    //     }
    //   }
    // }
    if (req.query.price) {
      const priceValue = req.query.price.slice(1, req.query.price.length);
      if (req.query.price.includes(">")) {
        match.price = { $gte: priceValue };
      } else if (req.query.price.includes("<")) {
        match.price = { $lte: priceValue };
      } else {
        match.price = req.query.price;
      }
    }

    if (req.query.hashtag) {
      match.hashtag = req.query.hashtag;
    }
    if (req.query.limit) {
      options.limit = parseInt(req.query.limit);
    }
    if (req.query.skip) {
      options.skip = parseInt(req.query.skip);
    }

    if (req.query.filter) {
      const parts = req.query.filter.split("_");
      console.log(parts[2]);
      match[parts[0]] = {
        $gte: parseInt(parts[1]),
        $lte: parts[2] === undefined ? 100000000000 : parseInt(parts[2])
      };
    }

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split("_");
      const sort = {};
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
      options.sort = sort;
    }

    await req.user
      .populate({
        path: "items",
        match,
        options
      })
      .execPopulate();
    res.status(200).send(req.user.items);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/items/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const item = await Item.findOne({ _id, owner: req.user._id });

    if (!item) return res.status(404).send();
    res.status(200).send(item);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/items/:id", auth, async (req, res) => {
  const _id = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["itemName", "price"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid property for updating" });

  try {
    const item = await Item.findOne({ _id, owner: req.user._id });

    if (!item) {
      return res.status(404).send();
    }

    updates.forEach(update => {
      item[update] = req.body[update];
    });
    await item.save();
    res.status(200).send(item);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/items/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const item = await Item.findOneAndDelete({ _id, owner: req.user._id });
    if (!item) return res.status(404).send();
    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
