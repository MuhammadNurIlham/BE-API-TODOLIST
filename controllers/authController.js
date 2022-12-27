import userModels from "../models/userModels.js";
import Joi from "joi";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const register = async (req, res, next) => {
    try {

        const schema = Joi.object({
            name: Joi.string().min(5).required(),
            phone: Joi.string().min(12).required(),
            email: Joi.string().email().min(6).required(),
            username: Joi.string().min(3).required(),
            password: Joi.string().min(6).required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.send({
                error: {
                    message: error.details[0].message,
                }
            });
        };

        // hashing password before save to database
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        // Check if email is already registered
        const isAlready = await userModels.find({
            email: req.body.email
        });

        if (isAlready.length >= 1) {
            return res.status(409).send({
                message: `Account with email: ${req.body.email} is Already`,
            });
        }

        const newUser = new userModels({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            username: req.body.username,
            password: hash
        });

        await newUser.save();

        res.status(200).send({
            status: "Success",
            message: "User has been registered",
            newUser
        });

    } catch (err) {
        console.log(err)
        next(err)
    };
};

export const login = async (req, res, next) => {
    try {

        const schema = Joi.object({
            email: Joi.string().email().min(6).required(),
            username: Joi.string().min(3).required(),
            password: Joi.string().min(6).required()
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(401).send({
                error: {
                    message: error ? error.details[0].message : `Email or Password not match`,
                },
            });
        };

        const user = await userModels.findOne({ username: req.body.username, email: req.body.email });
        if (!user) return next(createError(400, "Wrong password, email or username"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return next(createError(400, "Wrong password, email or username"));

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY);

        const { password, username, email, ...otherDetails } = user._doc;
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).send({
            status: "Success",
            message: "You are logged in",
            detail: {
                ...otherDetails
            },
            email,
            token
        });

    } catch (err) {
        console.log(err);
        next(err);
    };
};