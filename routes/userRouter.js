import { Router } from "express";
import {
    getLoginFormFormHandler,
    loginUserHandler,
    logoutUserHandler,
    listUsersHandler,
    getUserByIdHandler,
    getUserFormHandler,
    getUserEditFormHandler,
    createUserHandler,
    updateUserHandler,
    deleteUserHandler,
} from "../controllers/userController.js";
import {
    validateCreateUser,
    validateUpdateUser,
} from "../middleware/validation.js";
import { isAuth, isAdmin, restrictAdminField } from "../middleware/auth.js";

const userRouter = Router();

userRouter.get("/login", getLoginFormFormHandler);
userRouter.post("/login", loginUserHandler);
userRouter.get("/register", getUserFormHandler);
userRouter.post(
    "/register",
    restrictAdminField,
    validateCreateUser,
    createUserHandler
);
userRouter.get("/", isAuth, listUsersHandler);
userRouter.get("/:id", isAuth, getUserByIdHandler);
userRouter.post("/logout", logoutUserHandler);
userRouter.get("/:id/update", isAuth, getUserEditFormHandler);
userRouter.post(
    "/:id/update",
    isAuth,
    restrictAdminField,
    validateUpdateUser,
    updateUserHandler
);
userRouter.post("/:id/delete", isAdmin, deleteUserHandler);

export default userRouter;
