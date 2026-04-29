import express from 'express';
import Template from '../models/Template.js';
import { protect } from '../middleware/auth.js';
import mongoose from 'mongoose';
import logger from '../config/logger.js';
import { validateTemplate, handleTemplateValidation } from '../validators/templateValidator.js';
import { safeUser } from '../utils/sanitizeLog.js';

const router = express.Router();

// GET all templates
router.get('/', protect, async (req, res, next) => {
  try {
    const templates = await Template.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    logger.info(`Fetched templates for user ${req.user._id}`);
    res.json({ templates });

  } catch (error) {
    logger.error(`Fetch templates error: ${error.message}`);
    next(error);
  }
});

// CREATE template
router.post('/', protect, validateTemplate, async (req, res, next) => {
  if (handleTemplateValidation(req, next)) return;

  try {
    const { name, description, nodes, edges, viewport } = req.body;

    const template = new Template({
      user: req.user._id,
      name,
      description,
      nodes,
      edges,
      viewport,
    });

    const createdTemplate = await template.save();

    logger.info(`Template created by ${safeUser(req.user._id)}`);

    res.status(201).json({ template: createdTemplate });

  } catch (error) {
    logger.error(`Create template error: ${error.message}`);
    next(error);
  }
});

// DELETE template
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({ status: 400, message: 'Invalid template ID' });
    }

    const template = await Template.findById(id);

    if (!template || template.user.toString() !== req.user._id.toString()) {
      logger.warn(`Unauthorized delete attempt: ${id}`);
      return next({ status: 404, message: 'Template not found or unauthorized' });
    }

    await template.deleteOne();

    logger.info(`Template deleted: ${id}`);
    res.json({ message: 'Template deleted' });

  } catch (error) {
    logger.error(`Delete template error: ${error.message}`);
    next(error);
  }
});

// UPDATE template
router.put('/:id', protect, validateTemplate, async (req, res, next) => {
  try {
    if (handleTemplateValidation(req, next)) return;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({ status: 400, message: 'Invalid template ID' });
    }

    const template = await Template.findById(id);

    if (!template || template.user.toString() !== req.user._id.toString()) {
      logger.warn(`Unauthorized update attempt: ${id}`);
      return next({ status: 404, message: 'Template not found or unauthorized' });
    }

    if (req.body.name !== undefined) {
      template.name = req.body.name;
    }

    const updated = await template.save();

    logger.info(`Template updated: ${id}`);
    res.json({ template: updated });

  } catch (error) {
    logger.error(`Update template error: ${error.message}`);
    next(error);
  }
});

export default router;