const {Schema, model, Types} = require("mongoose");

const announcementSchema = new Schema({
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
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
    maxlength: 500
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
  popertyType: {
    type: String,
    required: true
  },
  dwellingType: {
    type: String,
    required: true,
  },
  seller: {
    type: Types.ObjectId,
    ref: "User"
  },
  favourites: {
    type: [Types.ObjectId],
    ref: "User",
    default: [],
  }

});

const Announcement = model("Announcement", announcementSchema);