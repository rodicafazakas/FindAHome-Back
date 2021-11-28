const bcrypt = require("bcrypt");
const {
  getAnnouncements,
  getAnnouncementById,
  getFavouriteAnnouncements,
  getMyAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("./announcementsControllers");
const Announcement = require("../../database/models/Announcement");
const User = require("../../database/models/User");

jest.mock("../../database/models/Announcement");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Given a getAnnouncements function", () => {
  describe("When it is invoked", () => {
    test("Then it should return a list of announcements", async () => {
      const req = {
        query: {},
      };
      const announcementsList = [
        {
          price: 550000,
          images: [
            "https://prd.storagewhise.eu/public/latourpetit/Pictures/4568230/640/baaab301df4a42f9a94eda0b1c515853.jpg",
          ],
          area: 160,
          bedrooms: 4,
          bathrooms: 2,
          description:
            "It is located on the 6th floor and has a magnificent view. It is composed as follows: entrance hall, cloakroom, guest toilet with independent washbasin, living and dining room of ± 41 m², equipped kitchen of 15m², night hall leading to 4 bedrooms (± 10,4 - 11,5 - 13,5 and 16m² ), 1 bathroom and an independent shower room.",
          parking: false,
          terrace: false,
          elevator: false,
          city: "Barcelona",
          neighbourhood: "Sarria-Sant Gervasi",
          propertyType: "dwelling",
          dwellingType: "apartment",
          seller: "619ccdd9adede94481d5c2aa",
          address: {
            street: "Calle de Balmes",
            floor: 6,
            coordinates: {
              longitude: 200,
              latitude: 300,
            },
          },
        },
        {
          price: 355000,
          images: [
            "https://prd.storagewhise.eu/public/latourpetit/Pictures/4568230/640/baaab301df4a42f9a94eda0b1c515853.jpg",
          ],
          area: 100,
          bedrooms: 2,
          bathrooms: 2,
          description:
            "It is located on the 6th floor and has a magnificent view. It is composed as follows: entrance hall, cloakroom, guest toilet with independent washbasin, living and dining room of ± 41 m², equipped kitchen of 15m², night hall leading to 4 bedrooms (± 10,4 - 11,5 - 13,5 and 16m² ), 1 bathroom and an independent shower room.",
          parking: false,
          terrace: true,
          elevator: false,
          city: "Barcelona",
          neighbourhood: "Sarria-Sant Gervasi",
          propertyType: "dwelling",
          dwellingType: "apartment",
          seller: "619ccdd9adede94481d5c2aa",
          address: {
            street: "Calle de Balmes",
            floor: 6,
            coordinates: {
              longitude: 200,
              latitude: 300,
            },
          },
        },
      ];
      const res = {
        json: jest.fn(),
      };
      Announcement.find = jest.fn().mockResolvedValue(announcementsList);

      await getAnnouncements(req, res);

      expect(Announcement.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(announcementsList);
    });
  });
});

describe("Given a getAnnouncementById function", () => {
  describe("When it receives a request with an id of 111, a response object and a next function", () => {
    test("Then it should invoke the res.json with the searched announcement ", async () => {
      const announcementId = 111;
      const req = {
        params: {
          announcementId,
        },
      };
      const res = mockResponse();
      const next = jest.fn();
      const searchedAnnouncement = {};
      Announcement.findById = jest.fn().mockResolvedValue(searchedAnnouncement);

      await getAnnouncementById(req, res, next);

      expect(res.json).toHaveBeenCalledWith(searchedAnnouncement);
    });
  });

  describe("When Announcement.findById rejects", () => {
    test("Then it should invoke the next function with the error", async () => {
      const req = {
        params: {
          announcementId: 10,
        },
      };
      const res = mockResponse();
      const next = jest.fn();
      const error = {};
      Announcement.findById = jest.fn().mockRejectedValue(error);

      await getAnnouncementById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getFavouriteAnnouncements function", () => {
  describe("When it is called", () => {
    test("Then it should invoke the res.json to render the favourite announcements of the logged buyer", async () => {
      const req = {
        username: "Rodipet",
        password: "holaciao",
      };
      const res = {
        json: jest.fn(),
      };
      const user = {
        name: "Rodi",
        username: "Rodipet",
        password: "holaciao",
        phoneNumber: "644653848",
        favourites: ["619cd09483dd11257034127c", "619e6a6fc665ebc5ac1da426"],
        adverts: [],
        customerType: "buyer",
      };

      User.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(user),
      });
      await getFavouriteAnnouncements(req, res);

      expect(res.json).toHaveBeenCalledWith(user.favourites);
    });
  });
});

describe("Given a getMyAnnouncements function", () => {
  describe("When it is called", () => {
    test("Then it invokes the res.json to render the announcements of the logged seller", async () => {
      const req = {
        username: "Sanda",
        password: "mariasanda",
      };
      const res = {
        json: jest.fn(),
      };
      const user = {
        name: "Maria",
        username: "Sanda",
        password: "mariasanda",
        phoneNumber: "645653748",
        favourites: [],
        adverts: ["61a15d5dc2cd6312f9a20636"],
        customerType: "seller",
      };

      User.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(user),
      });
      await getMyAnnouncements(req, res);

      expect(res.json).toHaveBeenCalledWith(user.adverts);
    });
  });
});

describe("Given a createAnnouncement function", () => {
  describe("When it receives a request from a logged user with customerType of buyer", () => {
    test("Then it should invoke the next function with the 403 error", async () => {
      const req = {
        body: {
          name: "Marti",
          username: "nica",
          password: await bcrypt.hash("Martinica", 10),
          phoneNumber: "645205748",
          favourites: [],
          adverts: [],
          customerType: "buyer",
        },
      };
      const next = jest.fn();
      const error = new Error("Forbidden: only seller can update announcement");
      error.code = 403;

      await createAnnouncement(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a request from a logged user with customer type of seller", () => {
    test("Then it should invoke the res.json with the new announcement and a 201 status", async () => {
      const newAnnouncement = {
        price: 355000,
        images: [
          "https://prd.storagewhise.eu/public/latourpetit/Pictures/4568230/640/baaab301df4a42f9a94eda0b1c515853.jpg",
        ],
        area: 100,
        bedrooms: 2,
        bathrooms: 2,
        description:
          "It is located on the 6th floor and has a magnificent view. It is composed as follows: entrance hall, cloakroom, guest toilet with independent washbasin, living and dining room of ± 41 m², equipped kitchen of 15m², night hall leading to 4 bedrooms (± 10,4 - 11,5 - 13,5 and 16m² ), 1 bathroom and an independent shower room.",
        parking: false,
        terrace: true,
        elevator: false,
        city: "Barcelona",
        neighbourhood: "Sarria-Sant Gervasi",
        propertyType: "dwelling",
        dwellingType: "apartment",
        seller: "619ccdd9adede94481d5c2aa",
        address: {
          street: "Calle de Balmes",
          floor: 6,
          coordinates: {
            longitude: 200,
            latitude: 300,
          },
        },
      };
      const req = {
        body: {
          newAnnouncement,
        },
      };
      const res = mockResponse();
      const next = jest.fn();
      Announcement.create = jest.fn().mockResolvedValue(newAnnouncement);

      await createAnnouncement(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newAnnouncement);
    });
  });

  describe("When the Announcement.create rejects", () => {
    test("Then it should invoke the next funcition with a 400 error", async () => {
      const newAnnouncement = {
        price: 355000,
        images: [
          "https://prd.storagewhise.eu/public/latourpetit/Pictures/4568230/640/baaab301df4a42f9a94eda0b1c515853.jpg",
        ],
        area: 100,
        bedrooms: 2,
        bathrooms: 2,
        description:
          "It is located on the 6th floor and has a magnificent view. It is composed as follows: entrance hall, cloakroom, guest toilet with independent washbasin, living and dining room of ± 41 m², equipped kitchen of 15m², night hall leading to 4 bedrooms (± 10,4 - 11,5 - 13,5 and 16m² ), 1 bathroom and an independent shower room.",
        parking: false,
        terrace: true,
        elevator: false,
        city: "Barcelona",
        neighbourhood: "Sarria-Sant Gervasi",
        propertyType: "dwelling",
        dwellingType: "apartment",
        seller: "619ccdd9adede94481d5c2aa",
        address: {
          street: "Calle de Balmes",
          floor: 6,
          coordinates: {
            longitude: 200,
            latitude: 300,
          },
        },
      };
      const req = {
        body: {
          newAnnouncement,
        },
      };
      const res = mockResponse();
      const next = jest.fn();
      const error = {};
      Announcement.create = jest.fn().mockRejectedValue(error);

      await createAnnouncement(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given an updateAnnouncement function", () => {
  describe("When it receives a request from a logged user with customer type of seller with id of 111", () => {
    test("Then it should invoke res.json with the announcement to update", async () => {
      const req = {
        params: {
          announcementId: 111,
        },
      };
      const res = mockResponse();
      const next = jest.fn();
      const announcementToUpdate = {};
      Announcement.findByIdAndUpdate = jest
        .fn()
        .mockResolvedValue(announcementToUpdate);
      await updateAnnouncement(req, res, next);
      expect(res.json).toHaveBeenCalledWith(announcementToUpdate);
    });
  });

  describe("When it receives a bad announcementId", () => {
    test("Then it should invoke the next function with an error", async () => {
      const req = {
        params: {
          announcementId: null,
        },
      };
      const next = jest.fn();
      const error = new Error();
      Announcement.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

      await updateAnnouncement(req, null, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a deleteAnnouncement function", () => {
  describe("When it receives a request from a logged user with customerType of seller and id of 111", () => {
    test("Then it should invoke the res.json with the announcement to delete", async () => {
      const req = {
        params: {
          announcemtId: 111,
        },
      };
      const res = mockResponse();
      const next = jest.fn();
      const announcementToDelete = {};
      Announcement.findByIdAndDelete = jest
        .fn()
        .mockResolvedValue(announcementToDelete);
      await deleteAnnouncement(req, res, next);
      expect(res.json).toHaveBeenCalledWith(announcementToDelete);
    });
  });

  describe("When the announcement to delete is not found", () => {
    test("Then it should invoke the next function with a 404 error", async () => {
      const req = {
        params: {
          announcementId: 111,
        },
      };
      const next = jest.fn();
      const expectedError = new Error("Announcement not found");
      Announcement.findByIdAndDelete = jest
        .fn()
        .mockRejectedValue(expectedError);

      await deleteAnnouncement(req, null, next);
      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
