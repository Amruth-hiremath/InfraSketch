import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: '',
  },

  nodes: {
    type: Array,
    required: true,
  },

  edges: {
    type: Array,
    required: true,
  },

  viewport: {
    type: Object,
    default: {},
  },

}, { timestamps: true });

export default mongoose.model('Template', templateSchema);