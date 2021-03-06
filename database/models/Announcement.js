const { Schema, model, Types } = require("mongoose");

const announcementSchema = new Schema({
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 1000,
  },
  parking: {
    type: Boolean,
  },
  terrace: {
    type: Boolean,
  },
  elevator: {
    type: Boolean,
  },
  city: {
    type: String,
    required: true,
  },
  neighbourhood: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    coordinates: {
      longitude: {
        type: Number
      },
      latitude: {
        type: Number
      },
    },
  },
  propertyType: {
    type: String
  },
  dwellingType: {
    type: String,
    required: true,
  },
  seller: {
    type: Types.ObjectId,
    ref: "User",
  },
});

const Announcement = model("Announcement", announcementSchema);

module.exports = Announcement;
