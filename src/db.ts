
import { MongoClient } from "mongodb";
import { userDB } from "./models";

const url = "mongodb+srv://samperisisamuel:FedeChiesa07@UserDB.yvd6jyw.mongodb.net/?retryWrites=true&w=majority";

export const tryConnectionDB = async () => {
    console.log("asbias");
    const client = await new MongoClient(url);
    try{
        await (await client.connect()).db("UserDB");
    } catch(err) {
        console.error(err);
        throw new Error("err...");
    }
};
/*
export const createCollection = async (name: string): Promise<boolean> => {
    const client = await new MongoClient(url);
    try{
        const db = await (await client.connect()).db("UserDB");
        await db.createCollection<user>(name);
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}
*/
export const insertOne = async (newObj: userDB) => {
    const client = new MongoClient(url);
    try{
        await client.connect();
        await client.db("UserDB").collection("UsersCollection").insertOne(newObj);
    } catch(e) {
        console.error(e);
        throw new Error("Insert err...");
    }
}

export const find = async (email: string): Promise<userDB | null> => {
    const client = new MongoClient(url);
    try{
        await client.connect();
        return await client.db("UserDB").collection<userDB>("UsersCollection").findOne({email: email}, {projection: {_id: 0}});
    } catch(e) {
        console.error(e);
        return null;
    }
}
