const { notFoundErrorHandler, generalErrorHandler } = require('./errors');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Given a notFoundErrorHandler ', () => {
  describe('When it is called', () => {
    test('Then it should invoke the res.json function with a 404 error', async () => {
      const res = mockResponse();

      await notFoundErrorHandler(null, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
    })
  })
});

describe('Given a generalErrorHandler ', () => {
  describe('When it is called', ()=>{
    test('Then it should return a 500 error ', async () => {
      const error = new Error();
      const res = mockResponse();
      await generalErrorHandler(error, null, res, null);
      expect(res.status).toHaveBeenCalledWith(500);
    })
  })
})