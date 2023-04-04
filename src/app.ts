//Use process.env
import express, {Request, Response, NextFunction} from "express"
import { body, header, validationResult } from "express-validator";
import { write, overwrite, read, sshKey } from "./utils";
import bycript from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { User } from "./models";
import jwt, { JwtPayload } from "jsonwebtoken";
import { promises as fs } from "fs";

export const app = express();
app.use(express.json());

export let users: User[] = [];
export const saltRounds = 10;

const checkEmail = (req: Request, res: Response, next: NextFunction) => {
    if(users && users.some((user) => user.email == req.body.email)) res.status(409).json({message: "email already present..."});
    else next();
};

const showErrors = (req: Request, res: Response, next: NextFunction) => validationResult(req).isEmpty() ? next() : res.status(400).json({errors: validationResult(req).array()});

app.post("/signup", body("name").exists().isString(), body("surname").exists().isString(), body("password").exists().isString().isLength({min: 8}), body("email").exists().isString().isEmail(),
    showErrors, checkEmail, async ({ body }, res) => {
    body.password = await bycript.hash(body.password, saltRounds);
    body.id = uuidv4();
    body.verify = uuidv4();
    try {
        await write(body);
        users.push({...body});
        console.log(body.verify);
        delete body.password;
        delete body.verify;
        res.status(201).json(body)
    } catch (e) {
        console.error(e);
        res.json({message: "Insert err..."});
    }
});

app.post("/login", body("email").exists().isString().isEmail(), body("password").exists().isString(), showErrors, async ({body}, res) => {
    const user = users.find(({email, verify}) => email == body.email && !verify);
    if(!user) res.status(401).json({message: "user not found..."});
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
    const user = users.find(({verify}) => verify === params.token);
    if(!user) res.status(400).json({message: "user not found..."});
    else {
        users = users.filter(({verify}) => verify !== user.verify);
        delete user.verify;
        users.push(user);
        await overwrite(users);
        res.json({message: "confirmed user"});
    }
});

app.get("/me", header("authorization").isJWT(), showErrors, async ({headers}, res) => {
    try{
        const user = (await jwt.verify(headers.authorization as string, sshKey)) as JwtPayload;
        if(!users.some(({email}) => email === user.email)) return res.status(400).json({message: "not autorizhed"});
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

app.listen(3001, async () => {
    await fs.writeFile("database.json", JSON.stringify([]));
    users = JSON.parse(await fs.readFile("database.json", "binary"));
    //users = await read();
    console.log("Server is running");
  });
  