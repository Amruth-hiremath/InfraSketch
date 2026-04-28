import express from 'express';
import Diagram from '../models/Diagram.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/diagrams
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const diagrams = await Diagram.find({ user: req.user._id })
      .select('name description createdAt updatedAt nodes.length')
      .sort({ updatedAt: -1 });
    res.json({ diagrams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/diagrams/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const diagram = await Diagram.findById(req.params.id);

    if (diagram && diagram.user.toString() === req.user._id.toString()) {
      res.json({ diagram });
    } else {
      res.status(404).json({ message: 'Diagram not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/diagrams
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, description, nodes, edges, viewport } = req.body;

  try {
    const diagram = new Diagram({
      user: req.user._id,
      name,
      description,
      nodes,
      edges,
      viewport,
    });

    const createdDiagram = await diagram.save();
    res.status(201).json({ diagram: createdDiagram });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/diagrams/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { name, description, nodes, edges, viewport } = req.body;

  try {
    const diagram = await Diagram.findById(req.params.id);

    if (diagram && diagram.user.toString() === req.user._id.toString()) {
      diagram.name = name || diagram.name;
      diagram.description = description !== undefined ? description : diagram.description;
      diagram.nodes = nodes || diagram.nodes;
      diagram.edges = edges || diagram.edges;
      diagram.viewport = viewport || diagram.viewport;

      const updatedDiagram = await diagram.save();
      res.json({ diagram: updatedDiagram });
    } else {
      res.status(404).json({ message: 'Diagram not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/diagrams/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const diagram = await Diagram.findById(req.params.id);

    if (diagram && diagram.user.toString() === req.user._id.toString()) {
      await Diagram.deleteOne({ _id: req.params.id });
      res.json({ message: 'Diagram removed' });
    } else {
      res.status(404).json({ message: 'Diagram not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
