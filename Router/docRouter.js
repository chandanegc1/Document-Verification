import { Router } from "express";
import { createDocument, createJob, deletejob, getAllJobs, getJob, getUserDoc, showStats, updateJob } from "../controllers/DocController.js";
import { validateJobInput } from "../Middleware/ValidationMiddleware.js";
import { authenticateUser } from "../Middleware/authMiddleware.js";
import upload from "../Middleware/multerMiddleware.js";

const router = Router();

router.route("/").post(authenticateUser, validateJobInput,createJob).get(authenticateUser ,getAllJobs);
router.route("/stats").get(authenticateUser ,showStats)
router.get('/user-docs/:id',authenticateUser, getUserDoc);
router.route("/:id").get(authenticateUser ,getJob).delete(authenticateUser , deletejob).put(authenticateUser , updateJob);
router.post('/create-doc',authenticateUser, upload.single('avatar'), createDocument);
export default router;