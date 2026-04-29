import express from 'express';
import Diagram from '../models/Diagram.js';
import { protect } from '../middleware/auth.js';
import mongoose from 'mongoose';
import logger from '../config/logger.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const validateDiagram = [
  body('name')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be 1–100 characters'),

  body('description')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Description too long'),

  body('nodes')
    .optional()
    .isArray()
    .withMessage('Nodes must be an array'),

  body('edges')
    .optional()
    .isArray()
    .withMessage('Edges must be an array'),

  body('viewport')
    .optional()
    .isObject()
    .withMessage('Viewport must be an object'),

  body('viewport.x')
    .optional()
    .isNumeric(),

  body('viewport.y')
    .optional()
    .isNumeric(),

  body('viewport.zoom')
    .optional()
    .isNumeric(),
];

const handleValidation = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next({
      status: 400,
      message: errors.array()[0].msg,
    });
    return true;
  }
  return false;
};

// GET ALL
router.get('/', protect, async (req, res, next) => {  
  try {
    const diagrams = await Diagram.find({ user: req.user._id })
      .select('name description createdAt updatedAt nodes')
      .sort({ updatedAt: -1 });

    const formatted = diagrams.map(d => ({
      ...d.toObject(),
      nodeCount: d.nodes.length
    }));
    logger.info(`Fetched diagrams for user ${req.user._id}`);
    res.json({ diagrams: formatted });
  } catch (error) {
    logger.error(`Fetch diagrams error: ${error.message}`);
    next(error);
  }
});

// GET ONE
router.get('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({ status: 400, message: 'Invalid diagram ID' });
    }
    const diagram = await Diagram.findById(req.params.id);

    if (diagram && diagram.user.toString() === req.user._id.toString()) {
      res.json({ diagram });
    } else {
      logger.warn(`Unauthorized diagram access: ${req.params.id}`);
      return next({ status: 404, message: 'Diagram not found or unauthorized' });
    }
  } catch (error) {
    logger.error(`Fetch diagram error: ${error.message}`);
    next(error);
  }
});

// CREATE
router.post('/', protect, validateDiagram, async (req, res, next) => {
  try {
    if (handleValidation(req, next)) return;
    const diagram = new Diagram({
      user: req.user._id,
      ...req.body
    });

    const created = await diagram.save();
    logger.info(`Diagram created by user ${req.user._id}`);
    res.status(201).json({ diagram: created });
  } catch (error) {
    logger.error(`Create diagram error: ${error.message}`);
    next(error);
  }
});

// UPDATE (rename + full update)
router.put('/:id', protect, validateDiagram, async (req, res, next) => {
  try {
    if (handleValidation(req, next)) return;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({ status: 400, message: 'Invalid diagram ID' });
    }
    const diagram = await Diagram.findById(req.params.id);

    if (diagram && diagram.user.toString() === req.user._id.toString()) {

      const { name, description, nodes, edges, viewport } = req.body;

      if (name !== undefined) diagram.name = name;
      if (description !== undefined) diagram.description = description;
      if (nodes !== undefined) diagram.nodes = nodes;
      if (edges !== undefined) diagram.edges = edges;
      if (viewport !== undefined) diagram.viewport = viewport;

      const updated = await diagram.save();
      logger.info(`Diagram updated: ${req.params.id}`);
      res.json({ diagram: updated });

    } else {
      logger.warn(`Unauthorized update attempt: ${req.params.id}`);
      return next({ status: 404, message: 'Diagram not found or unauthorized' });
    }
  } catch (error) {
    logger.error(`Update diagram error: ${error.message}`);
    next(error);
  }
});

// DELETE
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({ status: 400, message: 'Invalid diagram ID' });
    }
    const diagram = await Diagram.findById(req.params.id);

    if (diagram && diagram.user.toString() === req.user._id.toString()) {
      await diagram.deleteOne();
      logger.info(`Diagram deleted: ${req.params.id}`);
      res.json({ message: 'Diagram removed' });
    } else {
      logger.warn(`Unauthorized delete attempt: ${req.params.id}`);
      return next({ status: 404, message: 'Diagram not found or unauthorized' });
    }
  } catch (error) {
    logger.error(`Delete diagram error: ${error.message}`);
    next(error);
  }
});

// @route   GET /api/diagrams/public/:id
// @access  Public

router.get('/public/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({
        status: 400,
        message: 'Invalid diagram ID',
      });
    }

    const diagram = await Diagram.findById(id);

    if (!diagram || !diagram.isPublic) {
      return next({
        status: 404,
        message: 'Diagram not found or not public',
      });
    }

    res.json({
      id: diagram._id,
      name: diagram.name,
      description: diagram.description,
      nodes: diagram.nodes,
      edges: diagram.edges,
      viewport: diagram.viewport,
    });

  } catch (error) {
    logger.error(`Fetch public diagram error: ${error.message}`);
    next(error);
  }
});

router.patch('/:id/visibility', protect, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({
        status: 400,
        message: 'Invalid diagram ID',
      });
    }

    const diagram = await Diagram.findById(id);

    if (!diagram) {
      return next({
        status: 404,
        message: 'Diagram not found',
      });
    }

    if (diagram.user.toString() !== req.user._id.toString()) {
      return next({
        status: 403,
        message: 'Not authorized',
      });
    }

    diagram.isPublic = !diagram.isPublic;
    await diagram.save();

    res.json({
      success: true,
      isPublic: diagram.isPublic,
    });

  } catch (error) {
    logger.error(`Update diagram visibility error: ${error.message}`);
    next(error);
  }
});

export default router;