//Todo: use jwt
import express, {Request, Response, NextFunction} from "express"
import { body, header, validationResult } from "express-validator";
import { tryConnectionDB, insertOne, find } from "./db";
import bycript from "bcrypt";

const app = express();
app.use(express.json());

const auth = header("auth").custom((auth) => {
    if(auth!="Pippo") throw new Error("not authorized...");
    return true;
});

const showErrors = (req: Request, res: Response, next: NextFunction) => validationResult(req).isEmpty() ? next() : res.status(400).json({errors: validationResult(req).array()});

app.get("/db", auth, showErrors, async (_, res) => {
    try {
        await tryConnectionDB();
        console.log("ok2")
        res.json({message: "connected..."});
    } catch (err){
        console.error(err);
        res.json({message: "err..."});
    }
});

app.get("/register", auth, body("name").exists().isString(), body("surname").exists().isString(), body("email").exists().isString().isEmail(), body("password").exists().isString(),
    body("age").exists().isNumeric(), showErrors, async ({ body }, res) => {
    body.password = await bycript.hash(body.password, 8);
    try {
        await insertOne(body);
        res.json({message: "User added successfully"})
    } catch (e) {
        console.error(e);
        res.json({message: "Insert err..."});
    }
});

app.get("/login", auth , body("email").exists().isString().isEmail(), body("password").exists().isString(), showErrors, async ({body}, res) => {
    const user = await find(body.email);
    if(!user) res.status(401).json({message: "user not found..."});
    else if(!await bycript.compare(body.password, user.password)) res.json({message: "wrong password..."});
    else res.json(user);
});

app.listen("3000", () => console.log("Server is running..."));
