import express from "express";
import {
  findCandidate,
  saveCandidate,
  getCandidates,
} from "../../controllers/candidate";
import { authenticateJWT } from "../../middleware/auth";

const router = express.Router();

router.post("/", authenticateJWT, findCandidate);
router.post("/save", authenticateJWT, saveCandidate);
router.get("/get-all", authenticateJWT, getCandidates);

export default router;
