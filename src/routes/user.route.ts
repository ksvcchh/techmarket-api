import { Router } from "express";
import {
    getAllUsersController,
    getUserByIdController,
    createUserController,
    partlyChangeUserController,
    deleteUserController,
    getUserDetailsController,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getAllUsersController);
router.get("/:userId", getUserByIdController);
router.get("/:userId/details", getUserDetailsController);
router.post("/", createUserController);
router.patch("/:userId", partlyChangeUserController);
router.delete("/:userId", deleteUserController);

export default router;
