import express from 'express';
import Diagram from '../models/Diagram.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET ALL
router.get('/', protect, async (req, res) => {
  try {
    const diagrams = await Diagram.find({ user: req.user._id })
      .select('name description createdAt updatedAt nodes')
      .sort({ updatedAt: -1 });

    const formatted = diagrams.map(d => ({
      ...d.toObject(),
      nodeCount: d.nodes.length
    }));

    res.json({ diagrams: formatted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ONE
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

// CREATE
router.post('/', protect, async (req, res) => {
  try {
    const diagram = new Diagram({
      user: req.user._id,
      ...req.body
    });

    const created = await diagram.save();
    res.status(201).json({ diagram: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE (rename + full update)
router.put('/:id', protect, async (req, res) => {
  try {
    const diagram = await Diagram.findById(req.params.id);

    if (diagram && diagram.user.toString() === req.user._id.toString()) {

      const { name, description, nodes, edges, viewport } = req.body;

      if (name !== undefined) diagram.name = name;
      if (description !== undefined) diagram.description = description;
      if (nodes !== undefined) diagram.nodes = nodes;
      if (edges !== undefined) diagram.edges = edges;
      if (viewport !== undefined) diagram.viewport = viewport;

      const updated = await diagram.save();
      res.json({ diagram: updated });

    } else {
      res.status(404).json({ message: 'Diagram not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    const diagram = await Diagram.findById(req.params.id);

    if (diagram && diagram.user.toString() === req.user._id.toString()) {
      await diagram.deleteOne();
      res.json({ message: 'Diagram removed' });
    } else {
      res.status(404).json({ message: 'Diagram not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;