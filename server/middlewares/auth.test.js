const jwt = require('jsonwebtoken');
const auth = require('./auth');

jest.mock('jsonwebtoken');

describe('Given an auth function', () => {
  describe('When it receives arequest without an authorization', () => {
    test('Then it should invoke the next function with an error', async () => {
      const req = { 
        header: jest.fn(),
      };
      const next = jest.fn();
      const error = new Error('Missing authorization');
      error.code = 401;

      await auth(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    })
  })

  describe('When it receives an autorization with no token', () => {
    test('Then it should invoke the next function with error', async () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer '),
      }; 
      const next = jest.fn();
      const error = new Error('Missing token');
      error.code = 401;

      await auth(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    })
  })
 
  describe('When it receives an authorization with token', () => {
    test('Then it should invoke the next function', async() => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer token'),
      };
      const next = jest.fn();
      jwt.verify = jest.fn().mockReturnValue({username: 'username', password: 'password'});

      await auth(req, null, next);

      expect(next).toHaveBeenCalled();

    })
  })

  describe('When it receives an authorization with an incorrect token', () => {
    test('Then it should invoke the next function with an error', async () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer token'),
      };
      const next = jest.fn();
      const expectedError = new Error('Invalid token');
      expectedError.code = 401;
      const error = new Error();
      jwt.verify = jest.fn().mockRejectedValue(error);

      await auth(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
})