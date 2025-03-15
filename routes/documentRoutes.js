import { Router } from "express";
import { 
    createDocument, 
    createJob, 
    deleteJob, 
    getAllJobs, 
    getJob, 
    getUserDocuments, 
    showStats, 
    updateJob 
} from "../controllers/documentController.js";
import { validateJobInput } from "../middlewares/validationMiddleware.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";

const jobRouter = Router();

jobRouter.route("/")
    .post(authenticateUser, validateJobInput, createJob)
    .get(authenticateUser, getAllJobs);

jobRouter.get("/stats", authenticateUser, showStats);
jobRouter.get("/user-documents/:id", authenticateUser, getUserDocuments);
jobRouter.route("/:id")
    .get(authenticateUser, getJob)
    .delete(authenticateUser, deleteJob)
    .put(authenticateUser, updateJob);

jobRouter.post("/create-document", authenticateUser, upload.single("avatar"), createDocument);

export default jobRouter;