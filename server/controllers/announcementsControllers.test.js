const bcrypt = require("bcrypt");
const {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
} = require("./announcementsControllers");
const Announcement = require("../../database/models/Announcement");

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
      const announcementsList = [
        {
          price: 550000,
          images:
            "https://prd.storagewhise.eu/public/latourpetit/Pictures/4568230/640/baaab301df4a42f9a94eda0b1c515853.jpg",
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
          images:
            "https://prd.storagewhise.eu/public/latourpetit/Pictures/4568230/640/baaab301df4a42f9a94eda0b1c515853.jpg",
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

      await getAnnouncements(null, res);

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
      const next = () => {};
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
        images:
          "https://prd.storagewhise.eu/public/latourpetit/Pictures/4568230/640/baaab301df4a42f9a94eda0b1c515853.jpg",
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
        images:
          "https://prd.storagewhise.eu/public/latourpetit/Pictures/4568230/640/baaab301df4a42f9a94eda0b1c515853.jpg",
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
