import { Router } from "express";
import { getAlltUsers, getApplicationStats, getCurrentUser, updateUser } from "../controllers/userController.js";
import { authenticateUser, authorizePermissions } from "../Middleware/authMiddleware.js";
import upload from "../Middleware/multerMiddleware.js";
import {validateUpdateUserInput} from '../Middleware/ValidationMiddleware.js'

const router = Router();

router.get('/current-user',authenticateUser, getCurrentUser);
router.get('/all-users',authenticateUser,authorizePermissions, getAlltUsers);
// router.get('/admin/app-stats', [authorizePermissions('admin') , getApplicationStats]);// doubt
router.get('/admin/app-stats', getApplicationStats, authorizePermissions);
router.patch('/update-user',authenticateUser, upload.single('avatar'), updateUser);
export default router; 
