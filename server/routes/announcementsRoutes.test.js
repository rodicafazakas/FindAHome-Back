require("dotenv").config();
const debug = require("debug")("file:routes:tests");
const chalk = require("chalk");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const connectDB = require("../../database/index");
const Announcement = require("../../database/models/Announcement");
const User = require("../../database/models/User");
const { initializeServer, app } = require("../index");

const request = supertest(app);

let server;
// eslint-disable-next-line no-unused-vars
let token;

beforeAll(async () => {
  await connectDB(process.env.MONGODB_TEST_STRING);
  server = await initializeServer(3092);
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
  const { body } = await request
    .post("/users/login")
    .send({ username: "nica", password: "Martinica" })
    .expect(200);
  token = body.token;
  await Announcement.deleteMany();
  await Announcement.create({
    // _id: "619e2a5b4da2fdef638fcbc4",
    price: 300000,
    images: [],
    area: 100,
    bedrooms: 2,
    bathrooms: 1,
    description: "Ready to move in. Next to the hospital Vall dHebron",
    parking: false,
    terrace: false,
    elevator: false,
    city: "Barcelona",
    neighbourhood: "Teixonera",
    propertyType: "dwelling",
    dwellingType: "chalet",
    seller: "619e3158a2be75fbde47e373",
    favourites: [],
    address: {
      street: "Carrer Arenys",
      floor: 2,
      coordinates: {
        longitude: 405,
        latitude: 505,
      },
    },
  });
});

afterAll((done) => {
  server.close(async () => {
    await mongoose.connection.close();
    done();
  });
});

describe("Given an /announcements router", () => {
  describe("When a GET request arrives ", () => {
    test("Then it should respond with an array  of announcements and a 200 status", async () => {
      const { body } = await request.get("/announcements").expect(200);

      expect(body).toHaveLength(1);
    });
  });
});
