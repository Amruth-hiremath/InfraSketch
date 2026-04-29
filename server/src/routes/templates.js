import express from 'express';
import Template from '../models/Template.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


// 🔹 GET all templates (user-specific)
router.get('/', protect, async (req, res) => {
  try {
    const templates = await Template.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ templates });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔹 CREATE template
router.post('/', protect, async (req, res) => {
  try {
    const template = new Template({
      user: req.user._id,
      name: req.body.name,
      description: req.body.description,
      nodes: req.body.nodes,
      edges: req.body.edges,
      viewport: req.body.viewport,
    });

    const createdTemplate = await template.save();

    res.status(201).json({ template: createdTemplate });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔹 DELETE template (we’ll need this later)
router.delete('/:id', protect, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (template && template.user.toString() === req.user._id.toString()) {
      await template.deleteOne();
      res.json({ message: 'Template deleted' });
    } else {
      res.status(404).json({ message: 'Template not found or unauthorized' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (template && template.user.toString() === req.user._id.toString()) {

      if (req.body.name !== undefined) {
        template.name = req.body.name;
      }

      const updated = await template.save();
      res.json({ template: updated });

    } else {
      res.status(404).json({ message: 'Template not found or unauthorized' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;