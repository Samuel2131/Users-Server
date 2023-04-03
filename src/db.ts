
import { MongoClient } from "mongodb";
import { user } from "./models";

const url = "mongodb+srv://samperisisamuel:FedeChiesa07@UserDB.yvd6jyw.mongodb.net/?retryWrites=true&w=majority";

export const tryConnectionDB = async (): Promise<boolean> => {
    const client = await new MongoClient(url);
    try{
        await (await client.connect()).db("UserDB");
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
};

export const createCollection = async (name: string): Promise<boolean> => {
    const client = await new MongoClient(url);
    try{
        const db = await (await client.connect()).db("UserDB");
        await db.createCollection<user>("UsersCollection");
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

export const insertOne = async (newObj: user) => {
    const client = new MongoClient(url);
    try{
        await client.connect();
        await client.db("UserDB").collection("UsersCollection").insertOne(newObj);
    } catch(e) {
        console.error(e);
        throw new Error("Insert err...");
    }
}
