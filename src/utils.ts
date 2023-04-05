
import fs from "fs"
import { User } from "./models";

export const sshKey = "b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAlwAAAAdzc2gtcnNhAAAAAwEAAQAAAIEA2UEBh9CoKjibnhIsg5Zygdmu75WMQISwKC9ectjRR1gNzsc/OZqqvd15RHaK06at3cEBqyl4FyeSlitlOQYZjasfbuKqXZ0gQqUZyO5zANX/QMg9RJmQaZotfvbqG9HM91rPszNxphD3i+hbf/M0PNJUx8D3s0nU7F5DAUrRbEkAAAIQQLDHvECwx7wAAAAHc3NoLXJzYQAAAIEA2UEBh9CoKjibnhIsg5Zygdmu75WMQISwKC9ectjRR1gNzsc/OZqqvd15RHaK06at3cEBqyl4FyeSlitlOQYZjasfbuKqXZ0gQqUZyO5zANX/QMg9RJmQaZotfvbqG9HM91rPszNxphD3i+hbf/M0PNJUx8D3s0nU7F5DAUrRbEkAAAADAQABAAAAgQCYLXK3Aa9ps7E9rhlEKxQWZLam16ggYVFLNLMB22HsiX9SgjqFTROgXwxcqnRgAPb0yAc1L50RCwUg71C9+snWKaFXLz15QAFYLFiUjkeE3E8tDFU1h15QH314bPqqeqjOq2wTcuoRLGAMEpWEZASdRzQ6cNp/0W2+DivBmtcUAQAAAEEA3wOPx3eHHz3Vo/R3OvvROS8vcQnrqhgO4IMCQBryuQFZ8suJkYUC61Jv2LL43XDZkfoByRY23MXQmQsQBheQ4wAAAEEA86otqU7sda+AhNZ41iBSH7WKCmMuyUt6aVrsN7Rceq6ng38YRrYplBpSbBhWgXByUN/Y7FU8HFqWeZwjbCfHQQAAAEEA5ECNHlclMT2nOeZmxqALyWSp4npHnuI4T/bxwjzPeLz7PhlNeKFGlO0PRFTKKjvK4ssxp5qTkvxftV/VQZOrCQAAABR1c2VyQExBUFRPUC00Q04wN1NBUwECAwQF";

export const write = async (user: User) => {
    try{
        const arr = JSON.parse(await fs.readFileSync(process.env.DB as string, "utf-8").toString());
        arr.push(user)
        fs.writeFileSync(process.env.DB as string, JSON.stringify(arr, null, 2));
    } catch(err) {
        console.error(err);
    }
};

export const overwrite = async (arrUsers: Array<User>) => {
    try{
        fs.writeFileSync(process.env.DB as string, JSON.stringify(arrUsers, null, 2));
    } catch(err) {
        console.error(err);
    }
};

export const read = async (): Promise<Array<User>> => {
    try{
        const arr: Array<User> = JSON.parse(await fs.readFileSync(process.env.DB as string, "utf-8").toString());
        return arr;
    } catch(err) {
        console.error(err);
        return [];
    }
};