import { NextFunction, Request, Response } from "express";
import {
    User,
    getAllUsers,
    getUserById,
    createUser,
    partlyChangeUser,
    deleteUser,
    getUserWithRelations,
} from "../models/user.model";

export async function getAllUsersController(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export async function getUserByIdController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);
        user
            ? res.status(200).json(user)
            : res.status(404).json({ message: "User not found" });
    } catch (error) {
        next(error);
    }
}

export async function createUserController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { username, email, passwordHash, firstName, lastName } = req.body;
        const newUser: Omit<User, "id"> = {
            username,
            email,
            passwordHash,
            firstName,
            lastName,
        };

        const createdUser = await createUser(newUser);
        res.status(201).json({
            message: "User created successfully",
            data: createdUser,
        });
    } catch (error) {
        next(error);
    }
}

export async function partlyChangeUserController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        if (Object.keys(updateData).length === 0) {
            res.status(400).json({
                message: "No valid fields provided for update.",
            });
        } else {
            const updatedUser = await partlyChangeUser(userId, updateData);
            if (!updatedUser) {
                res.status(404).json({ message: "User not found" });
            } else {
                res.status(200).json({
                    message: "User successfully updated",
                    data: updatedUser,
                });
            }
        }
    } catch (error) {
        next(error);
    }
}

export async function deleteUserController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { userId } = req.params;
        const deletedUser = await deleteUser(userId);
        deletedUser
            ? res.status(200).json({
                  message: "User successfully deleted",
                  data: deletedUser,
              })
            : res.status(404).json({ message: "User not found" });
    } catch (error) {
        next(error);
    }
}

export async function getUserDetailsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { userId } = req.params;
        const user = await getUserWithRelations(userId);
        user
            ? res.status(200).json(user)
            : res.status(404).json({ message: "User not found" });
    } catch (error) {
        next(error);
    }
}
