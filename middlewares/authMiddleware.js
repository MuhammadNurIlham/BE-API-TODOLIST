import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(createError(401, "Unauthorized!"));
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return next(createError(403, "Token is not Valid!"));
        req.user = user;
        next();
        console.log(err);
        console.log(user);
    });
};

// for admin
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.body.email === "admin@mail.com"){
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        };
    });
};