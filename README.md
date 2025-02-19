# full-auth
vs code grate icon
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = "46a798172163ec4b4c84082ac71799da";
const ENDPOINT = "https://api.mailtrap.io/";
const client = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};
const recipients = [
  {
    email: "yohannesyeneakal1@gmail.com",
  }
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
dffwwwewewrrrooddssseerrdddssrrrdewwwd
npm i -D tailwindcss@3 postcss autoprfixer edit the commens
npm i -D tailwindcss@3 postcss autoprfixer edit the commens
ggfffff