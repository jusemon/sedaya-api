import { Router } from "express";
import roles from './roles.route';
import users from './users.route';

const router = Router();

router.use('/roles', roles);
router.use('/users', users);

export default router;