
import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    surname: String,
    password: String,
    verify: String
}, {versionKey: false});

export const UserDB = mongoose.model("user", UserSchema);

export type User = {
    id: string,
    name: string,
    email: string,
    surname: string,
    password: string,
    verify?: string
}

