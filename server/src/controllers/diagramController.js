import Diagram from '../models/Diagram.js';
import mongoose from 'mongoose';
import logger from '../config/logger.js';
import { safeUser } from '../utils/sanitizeLog.js';

// GET ALL
export const getDiagrams = async (req, res, next) => {
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
};

// GET ONE
export const getDiagramById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next({ status: 400, message: 'Invalid diagram ID' });
        }

        const diagram = await Diagram.findById(id);

        if (!diagram || diagram.user.toString() !== req.user._id.toString()) {
            logger.warn(`Unauthorized access: ${id}`);
            return next({ status: 404, message: 'Diagram not found or unauthorized' });
        }

        res.json({ diagram });

    } catch (error) {
        logger.error(`Fetch diagram error: ${error.message}`);
        next(error);
    }
};

// CREATE
export const createDiagram = async (req, res, next) => {
    try {
        const { name, description, nodes, edges, viewport } = req.body;

        const diagram = new Diagram({
            user: req.user._id,
            name,
            description,
            nodes,
            edges,
            viewport,
        });

        const created = await diagram.save();

        logger.info(`Diagram created by ${safeUser(req.user._id)}`);
        res.status(201).json({ diagram: created });

    } catch (error) {
        logger.error(`Create diagram error: ${error.message}`);
        next(error);
    }
};

// UPDATE
export const updateDiagram = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next({ status: 400, message: 'Invalid diagram ID' });
        }

        const diagram = await Diagram.findById(id);

        if (!diagram || diagram.user.toString() !== req.user._id.toString()) {
            logger.warn(`Unauthorized update attempt: ${id}`);
            return next({ status: 404, message: 'Diagram not found or unauthorized' });
        }

        const { name, description, nodes, edges, viewport } = req.body;

        if (name !== undefined) diagram.name = name;
        if (description !== undefined) diagram.description = description;
        if (nodes !== undefined) diagram.nodes = nodes;
        if (edges !== undefined) diagram.edges = edges;
        if (viewport !== undefined) diagram.viewport = viewport;

        const updated = await diagram.save();

        logger.info(`Diagram updated: ${id}`);
        res.json({ diagram: updated });

    } catch (error) {
        logger.error(`Update diagram error: ${error.message}`);
        next(error);
    }
};

// DELETE
export const deleteDiagram = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next({ status: 400, message: 'Invalid diagram ID' });
        }

        const diagram = await Diagram.findById(id);

        if (!diagram || diagram.user.toString() !== req.user._id.toString()) {
            logger.warn(`Unauthorized delete attempt: ${id}`);
            return next({ status: 404, message: 'Diagram not found or unauthorized' });
        }

        await diagram.deleteOne();

        logger.info(`Diagram deleted: ${id}`);
        res.json({ message: 'Diagram removed' });

    } catch (error) {
        logger.error(`Delete diagram error: ${error.message}`);
        next(error);
    }
};

// PUBLIC
export const getPublicDiagram = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next({ status: 400, message: 'Invalid diagram ID' });
        }

        const diagram = await Diagram.findById(id);

        if (!diagram || !diagram.isPublic) {
            return next({ status: 404, message: 'Diagram not found or not public' });
        }

        logger.info(`Public diagram accessed: ${id}`);

        res.json({
            id: diagram._id,
            name: diagram.name,
            description: diagram.description,
            nodes: diagram.nodes,
            edges: diagram.edges,
            viewport: diagram.viewport,
            isPublic: diagram.isPublic
        });

    } catch (error) {
        logger.error(`Public fetch error: ${error.message}`);
        next(error);
    }
};

// VISIBILITY
export const toggleVisibility = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next({ status: 400, message: 'Invalid diagram ID' });
        }

        const diagram = await Diagram.findById(id);

        if (!diagram) {
            return next({ status: 404, message: 'Diagram not found' });
        }

        if (diagram.user.toString() !== req.user._id.toString()) {
            return next({ status: 403, message: 'Not authorized' });
        }

        diagram.isPublic = !diagram.isPublic;
        await diagram.save();

        logger.info(`Visibility toggled: ${id}`);

        res.json({
            success: true,
            isPublic: diagram.isPublic,
        });

    } catch (error) {
        logger.error(`Visibility error: ${error.message}`);
        next(error);
    }
};