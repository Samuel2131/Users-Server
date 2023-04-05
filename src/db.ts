
import mongoose from "mongoose";
import { UserDB, User } from "./models";

const url = `mongodb+srv://samperisisamuel:FedeChiesa07@UserDB.yvd6jyw.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

mongoose.connect(url);

export const insertOne = async (newObj: User) => {
    try{
        const user = new UserDB(newObj);
        await user.save();
        return user;
    } catch(e) {
        console.error(e);
        throw new Error("Insert err...");
    }
}

export const getAll = async (): Promise<User[]> => {
    try{
        return await UserDB.find({});
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const replaceOne = async (filter: string, newUser: User) => {
    try {
        await UserDB.replaceOne({verify: filter}, newUser);
    } catch (err) {
        console.error(err);
    }
}

export const find = async (email: string): Promise<User | null> => {
    try{
        return await UserDB.findOne({email: email});
    } catch(e) {
        console.error(e);
        return null;
    }
}

export const findWithVerify = async (verify: string): Promise<User | null> => {
    try{
        return await UserDB.findOne({verify: verify});
    } catch(e) {
        console.error(e);
        return null;
    }
}

export const isIn = async (userEmail: string): Promise<boolean> => {
    try{
        return (await getAll()).some(({email}) => email === userEmail);
    } catch (err) {
        console.error(err);
        return false;
    }
}

export const drop = async () => {
    try {
        await UserDB.deleteMany({});
    } catch (err){
        console.error(err);
    }
}
