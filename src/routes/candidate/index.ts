import express from "express";
import {
  findCandidate,
  saveCandidate,
  getCandidates,
  getMessageHistory,
  getRecentSearches,
} from "../../controllers/candidate";
import { authenticateJWT } from "../../middleware/auth";

const router = express.Router();

router.post("/", authenticateJWT, findCandidate);
router.post("/save", authenticateJWT, saveCandidate);
router.get("/get-all", authenticateJWT, getCandidates);

router.get("/msg-history", authenticateJWT, getMessageHistory);
router.get("/recent-searches", authenticateJWT, getRecentSearches);

export default router;
