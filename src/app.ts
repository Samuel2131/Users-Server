
import express from "express"
import { tryConnectionDB, insertOne } from "./db";

const app = express();
app.use(express.json());

app.get("/db", async (req, res) => {
    try {
        await tryConnectionDB();
        console.log("ok2")
        res.json({message: "connected..."});
    } catch (err){
        console.error(err);
        res.json({message: "err..."});
    }
});
//Add sanification body, email, password
app.get("/register", async ({ body }, res) => {
    try {
        await insertOne(body);
        res.json({message: "User added successfully"})
    } catch (e) {
        console.error(e);
        res.json({message: "Insert err..."});
    }
});

//app.get("/login");

app.listen("3000", () => console.log("Server is running..."));
