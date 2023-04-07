
import express, {Request, Response, NextFunction} from "express"
import { body, header, validationResult } from "express-validator";
import bycript from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { find, findWithVerify, getAll, insertOne, replaceOne, isIn } from "./db";
import jwt, { JwtPayload } from "jsonwebtoken";

export const app = express();
app.use(express.json());

const sshKey = "**********";

export const saltRounds = 10;

const checkEmail = async (req: Request, res: Response, next: NextFunction) => {
    const users = await getAll();
    if(users && users.some((user) => user.email == req.body.email)) res.status(409).json({message: "email already present..."});
    else next();
};

const showErrors = (req: Request, res: Response, next: NextFunction) => validationResult(req).isEmpty() ? next() : res.status(400).json({errors: validationResult(req).array()});

app.post("/signup", body("name").notEmpty().isString(), body("surname").notEmpty().isString(), body("password").notEmpty().isString().isLength({min: 8}), body("email").notEmpty().isString().isEmail(),
    showErrors, checkEmail, async ({ body }, res) => {
    body.password = await bycript.hash(body.password, saltRounds);
    body.verify = uuidv4();
    try {
        let user = await insertOne(body);
        console.log(user.verify);
        res.status(201).json({id: user.id, name: user.name, surname: user.surname, email: user.email});
    } catch (e) {
        console.error(e);
        res.json({message: "Insert err..."});
    }
});

app.post("/login", body("email").notEmpty().isString().isEmail(), body("password").notEmpty().isString(), showErrors, async ({body}, res) => {
    const user = await find(body.email);
    if(!user || user.verify) res.status(401).json({message: "user not found..."});
    else if(!await bycript.compare(body.password, user.password)) res.status(401).json({message: "wrong password..."});
    else { 
        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            token: ""
        }
        userWithoutPassword.token = jwt.sign(userWithoutPassword, sshKey);
        res.json(userWithoutPassword);
    }
});

app.get("/validate/:token", async ({params}, res) => {
    const user = await findWithVerify(params.token);
    if(!user) res.status(400).json({message: "user not found..."});
    else {
        const verify = user.verify;
        await replaceOne(verify as string, {id: user.id, name: user.name, email: user.email, surname: user.surname, password: user.password});
        res.json({message: "confirmed user"});
    }
});

app.get("/me", header("authorization").isJWT(), showErrors, async ({headers}, res) => {
    try{
        const user = (await jwt.verify(headers.authorization as string, sshKey)) as JwtPayload;
        if(await !isIn(user.email)) return res.status(400).json({message: "not autorizhed"});
        res.json({
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email
        });
    } catch(err) {
        res.status(400).json({message: "not autorizhed"});
    }
});

app.listen(3001, async () => console.log("Server is running"));  