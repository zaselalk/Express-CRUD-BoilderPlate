const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

beforeEach((done) => {
  mongoose
    .connect(process.env.MONGODB_URI_TEST)
    .then(() => {
      console.log("Connected to DB");
      done();
    })
    .catch((err) => {
      console.log(err);
    });
});

afterEach((done) => {
  mongoose.connection.close().then(() => done());
});

describe("POST /api/products", () => {
  it("should create a new product", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Product 1",
      description: "Product 1 description",
      price: 100,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Product 1");
  });
});

describe("GET /api/products", () => {
  it("should return all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /api/products/:id", () => {
  it("should return a product by id", async () => {
    const product = await request(app).post("/api/products").send({
      name: "New Product",
      description: "Product 2 description",
      price: 200,
    });

    const res = await request(app).get(`/api/products/${product.body._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("New Product");
  });
});

describe("PATCH /api/products/:id", () => {
  it("should update a product by id", async () => {
    const product = await request(app).post("/api/products").send({
      name: "Product 3",
      description: "Product 3 description",
      price: 300,
    });

    const res = await request(app)
      .patch(`/api/products/${product.body._id}`)
      .send({ name: "Updated Product" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Product");
  });
});

describe("DELETE /api/products/:id", () => {
  it("should delete a product by id", async () => {
    const product = await request(app).post("/api/products").send({
      name: "Product 4",
      description: "Product 4 description",
      price: 400,
    });

    const res = await request(app).delete(`/api/products/${product.body._id}`);
    expect(res.statusCode).toBe(200);
  });
});
