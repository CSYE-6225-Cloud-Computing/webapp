import express from "express";
import * as UserController from '../controllers/users-controller.js';

const router = express.Router();

router.route('/users')
    .post(UserController.post)
    .get(UserController.index);

router.route('/users/:id')
    .get(UserController.get)
    .put(UserController.update)
    .delete(UserController.remove);

export default router;

