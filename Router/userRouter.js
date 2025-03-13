import { Router } from "express";
import { getAlltUsers, getApplicationStats, getCurrentHr, getCurrentUser, updateCD, updateHR } from "../controllers/userController.js";
import { authenticateUser } from "../Middleware/authMiddleware.js";
import upload from "../Middleware/multerMiddleware.js";
import {validateUpdateUserInput} from '../Middleware/ValidationMiddleware.js'

const router = Router();

router.get('/current-user',authenticateUser, getCurrentUser);
router.get('/current-hr',authenticateUser, getCurrentHr);
router.get('/all-users',authenticateUser, getAlltUsers);
// router.get('/admin/app-stats', [authorizePermissions('admin') , getApplicationStats]);// doubt
router.get('/admin/app-stats', getApplicationStats);
router.patch('/update-user',authenticateUser, upload.single('avatar'), updateCD);
router.patch('/update-hr',authenticateUser, upload.single('avatar'), updateHR);
export default router; 
