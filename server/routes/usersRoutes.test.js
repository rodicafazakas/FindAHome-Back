require("dotenv").config();
const debug = require("debug")("file:routes:tests");
const chalk = require("chalk");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const connectDB = require("../../database/index");
const User = require("../../database/models/User");
const { initializeServer, app } = require("../index");

const request = supertest(app);

let server;

jest.setTimeout(10000);

beforeAll(async () => {
  await connectDB(process.env.MONGODB_TEST_STRING);
  server = await initializeServer(4092);
});

beforeEach(async () => {
  debug(chalk.yellow("Before each test"));
  await User.deleteMany();
  await User.create({
    name: "Marti",
    username: "nica",
    password: await bcrypt.hash("Martinica", 10),
    phoneNumber: "645205748",
    favourites: [],
    adverts: [],
    customerType: "buyer",
  });
  await User.create({
    name: "Ana",
    username: "Maria",
    password: await bcrypt.hash("anamaria", 10),
    phoneNumber: "615305758",
    favourites: [],
    adverts: [],
    customerType: "seller",
  });
});

afterAll(async () => {
  await mongoose.connection.on("close", () => {
    debug(chalk.red("Connexion to database ended"));
  });
  await mongoose.connection.close();
  await server.on("close", () => {
    debug(chalk.red("Connexion to server ended"));
  });
  await server.close();
});

describe("Given a /login endpoint", () => {
  describe("When a POST request arrives with existing username and password", () => {
    test("Then it should respond with a token and a 200 status", async () => {
      const { body } = await request
        .post("/users/login")
        .send({ username: "nica", password: "Martinica" })
        .expect(200);

      expect(body.token).toBeDefined();
    });
  });
});

describe("Given a /register endpoint", () => {
  describe("When a POST request arrives  with a new username and password", () => {
    test("Then it should respond with a 201 status", async () => {
      await request
        .post("/users/register")
        .send({
          name: "Ina",
          username: "Monica",
          password: "inamonica",
          phoneNumber: "645653748",
          favourites: [],
          adverts: [],
          customerType: "seller"
        })
        .expect(201);
    });

  });
});
