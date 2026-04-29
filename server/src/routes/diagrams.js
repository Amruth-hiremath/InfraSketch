import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getDiagrams,
  getDiagramById,
  createDiagram,
  updateDiagram,
  deleteDiagram,
  getPublicDiagram,
  toggleVisibility
} from '../controllers/diagramController.js';

import { validateDiagram, handleValidation } from '../validators/diagramValidator.js';

const router = express.Router();

router.get('/', protect, getDiagrams);
router.get('/:id', protect, getDiagramById);

router.post('/', protect, validateDiagram, (req, res, next) => {
  if (handleValidation(req, next)) return;
  createDiagram(req, res, next);
});

router.put('/:id', protect, validateDiagram, (req, res, next) => {
  if (handleValidation(req, next)) return;
  updateDiagram(req, res, next);
});

router.delete('/:id', protect, deleteDiagram);

router.get('/public/:id', getPublicDiagram);
router.patch('/:id/visibility', protect, toggleVisibility);

export default router;