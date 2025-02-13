import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

// const TOKEN = process.env.MAILTRAP_TOKEN;
// const ENDPOINT = process.env.MAILTRAP_ENDPOINT;
 export const MailtrapClient = new MailtrapClient({
 endpoint:process.env.MAILTRAP_ENDPOINT,
 token: process.env.MAILTRAP_TOKEN
});

 export const sender = {
  email: "hello@demomailtrap.com",
  name: "yohannes yeneakal",
};


