require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../database/models/User");
const { loginUser, registerUser } = require("./usersControllers");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../database/models/User");

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
