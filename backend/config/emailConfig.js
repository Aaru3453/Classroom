// import dotenv from "dotenv";
// import nodemailer from "nodemailer";

// dotenv.config();

// const emailPass = process.env.EMAIL_PASSWORD
//   ? process.env.EMAIL_PASSWORD.replace(/\s/g, "")
//   : "";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: emailPass,
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("Email transporter error:", error.message);
//   } else {
//     console.log("Email transporter ready");
//   }
// });

// export default transporter;


import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk";

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export default apiInstance;