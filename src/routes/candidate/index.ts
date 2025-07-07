import express from 'express';
import { findCandidate } from '../../controllers/candidate';
import { authenticateJWT } from '../../middleware/auth';

const router = express.Router();

router.post('/find-candidate', authenticateJWT, findCandidate);

export default router; 