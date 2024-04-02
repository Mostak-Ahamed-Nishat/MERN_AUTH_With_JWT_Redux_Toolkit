import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    registerUser,
    authUser,
    logoutUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(getUserProfile).put(updateUserProfile);

export default router;