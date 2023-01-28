const express = require("express");
const routes = express.Router();
const { MongoClient } = require("mongodb");
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

routes.route("/products").get(function (req, res) {
  let db_connect = dbo.getDb("products");
  db_connect
    .collection("products")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.send(result);
    });
});

routes.route("/products").post(async (req, res) => {
  try {
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const quantity = req.body.quantity;
    const unit = req.body.unit;

    let db_connect = dbo.getDb("products");
    const product = await db_connect
      .collection("products")
      .find({ name: name })
      .toArray();
    if (product.length > 0) {
      res.status(400).send({ error: "Product name must be unique" });
    } else {
      const product = {
        name: name,
        price: price,
        description: description,
        quantity: quantity,
        unit: unit,
      };
      await db_connect.collection("products").insertOne(product);
      res.send(product);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

routes.route("/products/:id").put(async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const quantity = req.body.quantity;
    const unit = req.body.unit;

    if (price) {
      let db_connect = dbo.getDb("products");
      const product = await db_connect
        .collection("products")
        .findOneAndUpdate(
          { _id: ObjectId(id) },
          { $set: { price: price } },
          { returnOriginal: false }
        );
    }
    if (name) {
      let db_connect = dbo.getDb("products");
      const product = await db_connect
        .collection("products")
        .findOneAndUpdate(
          { _id: ObjectId(id) },
          { $set: { name: name } },
          { returnOriginal: false }
        );
    }
    if (description) {
      let db_connect = dbo.getDb("products");
      const product = await db_connect
        .collection("products")
        .findOneAndUpdate(
          { _id: ObjectId(id) },
          { $set: { description: description } },
          { returnOriginal: false }
        );
    }
    if (quantity) {
      let db_connect = dbo.getDb("products");
      const product = await db_connect
        .collection("products")
        .findOneAndUpdate(
          { _id: ObjectId(id) },
          { $set: { quantity: quantity } },
          { returnOriginal: false }
        );
    }
    if (unit) {
      let db_connect = dbo.getDb("products");
      const product = await db_connect
        .collection("products")
        .findOneAndUpdate(
          { _id: ObjectId(id) },
          { $set: { unit: unit } },
          { returnOriginal: false }
        );
    }
    res.send("Product updated");
  } catch (err) {
    res.status(500).send(err);
  }
});

routes.route("/products/:id").delete(async (req, res) => {
  try {
    const id = req.params.id;
    let db_connect = dbo.getDb("products");
    const product = await db_connect
      .collection("products")
      .findOneAndDelete({ _id: ObjectId(id) });
    res.send("Product deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

routes.route("/raport").get(function (req, res) {
  let db_connect = dbo.getDb("products");
  db_connect
    .collection("products")
    .aggregate([
      {
        $group: {
          _id: "$name",
          totalQuantity: { $sum: "$quantity" },
          totalPrice: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ])
    .toArray(function (err, result) {
      if (err) throw err;
      res.send(result);
    });
});

module.exports = routes;
