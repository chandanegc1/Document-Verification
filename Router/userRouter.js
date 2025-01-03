import { Router } from "express";
import { getAlltUsers, getApplicationStats, getCurrentUser, updateUser } from "../controllers/userController.js";
import { authenticateUser } from "../Middleware/authMiddleware.js";
import upload from "../Middleware/multerMiddleware.js";
import {validateUpdateUserInput} from '../Middleware/ValidationMiddleware.js'

const router = Router();

router.get('/current-user',authenticateUser, getCurrentUser);
router.get('/all-users',authenticateUser, getAlltUsers);
// router.get('/admin/app-stats', [authorizePermissions('admin') , getApplicationStats]);// doubt
router.get('/admin/app-stats', getApplicationStats);
router.patch('/update-user',authenticateUser, upload.single('avatar'), updateUser);
export default router; 
