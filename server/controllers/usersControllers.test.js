require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../database/models/User");
const {
  loginUser,
  registerUser,
  addFavourite,
  deleteFavourite,
} = require("./usersControllers");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../database/models/User");
jest.mock("../../database/models/Announcement");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Given a registerUser function", () => {
  describe("When it receives a new username and password", () => {
    test("Then it should respond with a new user and 201 status", async () => {
      const newUser = {
        username: "luis",
        password: "luisin",
      };
      const req = {
        body: newUser,
      };
      const res = mockResponse();
      const next = jest.fn();
      User.create = jest.fn().mockResolvedValue(newUser);

      await registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newUser);
    });
  });
});

describe("Given a loginUser function", () => {
  describe("When it receives a wrong username", () => {
    test("Then it should invoke the next function with an error", async () => {
      const req = {
        body: {
          username: "luis",
          password: "luis",
        },
      };
      User.findOne = jest.fn().mockResolvedValue({});
      const next = jest.fn();
      const expectedError = new Error("Wrong credentials");

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a valid username and a wrong password", () => {
    test("Then it should invoke the next function with an error", async () => {
      const req = {
        body: {
          username: "luis",
          password: "no marta",
        },
      };
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue({
        username: "luis",
        password: "marta",
      });
      bcrypt.compare = jest.fn();
      const expectedError = new Error("Wrong credentials");

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a valid username and password", () => {
    test("Then it should invoke the res.json with an object with a token inside", async () => {
      const req = {
        body: {
          username: "luis",
          password: "luis",
        },
      };
      const res = {
        json: jest.fn(),
      };
      User.findOne = jest.fn().mockResolvedValue({
        username: "luis",
        password: "luis",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      const expectedToken = "thetoken";
      jwt.sign = jest.fn().mockReturnValue(expectedToken);
      const expectedResponse = {
        token: expectedToken,
      };

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});

describe("Given an addFavourite function", () => {
  describe("When it receives a request from a logged user with customerType of seller", () => {
    test("It should invoke the next function with a 403 error", async () => {
      const req = {
        params: {
          userId: "333",
          announcementId: "222",
        },
        customerType: "seller",
      };
      const next = jest.fn();
      const error = new Error("Forbidden: only buyer can add to favourites");
      error.code = 403;

      await addFavourite(req, null, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives an announcementId that already exists", () => {
    test("Then it should invoke the res.json method with the logged buyer", async () => {
      const req = {
        params: {
          userId: "444",
          announcementId: "555",
        },
        customerType: "buyer",
      };
      const next = jest.fn();
      const res = {
        json: jest.fn(),
      };
      const error = new Error();
      error.code = 400;
      const loggedBuyer = {
        name: "Marti",
        username: "nica",
        password: await bcrypt.hash("Martinica", 10),
        phoneNumber: "645205748",
        favourites: ["555", "777"],
        adverts: [],
        customerType: "buyer",
        id: "444",
        save: jest.fn(),
      };
      User.findOne = jest.fn().mockResolvedValue(loggedBuyer);

      await addFavourite(req, res, next);
      expect(res.json).toHaveBeenCalledWith(loggedBuyer);
    });
  });
});

describe("Given a deleteFavourite function", () => {
  describe("When it receives a request from a logged user with customerType of seller", () => {
    test("Then it should invoke the next function with a 403 error", async () => {
      const req = {
        params: { userId: "3333", announcementId: "4444" },
        customerType: "seller",
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      const error = new Error(
        "Forbidden: only buyer can delete from favourites"
      );
      error.code = 403;

      await deleteFavourite(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives an announcementId from his favourites list", () => {
    test("Then it should invoke the res.json with the logged buyer with its new favourite list", async () => {
      const req = {
        params: {
          userId: "2345",
          announcementId: "777",
        },
        customerType: "buyer",
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      const loggedBuyer = {
        name: "Marti",
        username: "nica",
        password: await bcrypt.hash("Martinica", 10),
        phoneNumber: "645205748",
        favourites: ["555"],
        adverts: [],
        customerType: "buyer",
        id: "2345",
        save: jest.fn(),
      };
      User.findOne = jest.fn().mockResolvedValue(loggedBuyer);

      await deleteFavourite(req, res, next);
      expect(res.json).toHaveBeenCalledWith(loggedBuyer);
    });
  });
});
