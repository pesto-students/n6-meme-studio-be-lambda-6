const { Schema, model } = require('mongoose');

const memeSchema = new Schema({
  heading: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  thumbnail_url: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
  },
  dislikes: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
  },
  image_url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  created: {
    type: Date,
    required: true,
  },
  view_count: {
    type: [String],
    get: (v) => v.length,
  },
  state: {
    type: String,
    index: true,
  },
  status: {
    type: String,
    index: true,
  },
}, {
  toObject: { getters: true, setters: true },
  toJSON: { getters: true, setters: true },
  runSettersOnQuery: true,
});

// eslint-disable-next-line new-cap
module.exports = new model('Meme', memeSchema);
