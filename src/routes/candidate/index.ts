import express from 'express';
import { findCandidate, 
    getMessageHistory, 
    getRecentSearches 
} from '../../controllers/candidate';
import { authenticateJWT } from '../../middleware/auth';

const router = express.Router();

router.post('/', authenticateJWT, findCandidate);
router.get('/msg-history', authenticateJWT, getMessageHistory);
router.get('/recent-searches', authenticateJWT, getRecentSearches);

export default router; 