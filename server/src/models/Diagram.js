import mongoose from 'mongoose';

const nodeSchema = mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  data: { type: mongoose.Schema.Types.Mixed },
  measured: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

const edgeSchema = mongoose.Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
  type: { type: String },
  animated: { type: Boolean },
  style: { type: mongoose.Schema.Types.Mixed },
  sourceHandle: { type: String },
  targetHandle: { type: String },
}, { _id: false });

const diagramSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      default: 'Untitled Architecture',
    },
    description: {
      type: String,
      default: '',
    },
    nodes: [nodeSchema],
    edges: [edgeSchema],
    viewport: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      zoom: { type: Number, default: 1 },
    },
  },
  {
    timestamps: true,
  }
);

const Diagram = mongoose.model('Diagram', diagramSchema);

export default Diagram;
