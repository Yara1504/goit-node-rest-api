import sendGrid from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

const { SENDGRID_API_KEY } = process.env;

sendGrid.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
    const email = { ...data, from: "baykenichs@gmail.com" };
    await sendGrid.send(email);
    return true;
}

export default sendEmail;