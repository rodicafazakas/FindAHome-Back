const {
  getAnnouncements,
  getAnnouncementById,
} = require("./announcementsControllers");
const Announcement = require("../../database/models/Announcement");

jest.mock("../../database/models/Announcement");

describe("Given a getAnnouncements function", () => {
  describe("When it is invoked", () => {
    test("Then it should return a list of announcements", async () => {
      const announcementsList = [
        {
          price: 550000,
          image:
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
          image:
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
  describe("When it receives a request with an id of 619e6a6fc665ebc5ac1da426, a response object and a next function", () => {
    test("Then it should invoke the Announcement.findById with the given announcementId ", async () => {
      const announcementId = 111;
      const req = {
        params: {
          announcementId,
        },
      };
      const res = {
        json: jest.fn(),
      };
      const next = () => {};
      Announcement.findById = jest.fn().mockResolvedValue({});

      await getAnnouncementById(req, res, next);

      expect(Announcement.findById).toHaveBeenCalled();
    });
  });

  describe("When Announcement.findById rejects", () => {
    test("Then it should invoke the next function with the error", async () => {
      const req = {
        params: {
          announcementId: 0,
        },
      };
      const res = {};
      const next = jest.fn();
      const error = {};
      Announcement.findById = jest.fn().mockRejectedValue(error);

      await getAnnouncementById(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
