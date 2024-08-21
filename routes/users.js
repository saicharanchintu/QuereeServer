import express from 'express';

import { signup, login } from '../controllers/auth.js';
import { getAllUsers, addDisplayPicture, updateProfile} from '../controllers/users.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/getAllUsers', getAllUsers);

router.patch('/add-display-picture/:userId', auth, addDisplayPicture);
router.patch('/update/:id', auth, updateProfile);


export default router;