import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Sangeetam",
      link: "http://localhost:5173",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_ID,
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Email service failed silently");
    console.log("Error: ", error);
  }
};

const forgetPassMailContent = ({ name, forgetPassLink }) => {
  return {
    body: {
      name: name,
      intro: "We got a request to reset the password of our account",
      action: {
        instructions:
          "To reset your password click on the following button or link:",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: forgetPassLink,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const registerEmailtoAdmin = ({ name, email, dashboardLink }) => {
  return {
    body: {
      name: "Admin",
      intro: "Approval: new user registration",
      action: {
        instructions: `New User has requested for registration`,
        button: {
          color: "#22BC66",
          text: "Go To Dashboard",
          link: dashboardLink,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const registerEmailtoUser = ({ name, email }) => {
  return {
    body: {
      name: name,
      intro: "Thankyou for creating account",
      action: {
        instructions: `Your account is sent for approval to admin plase wait you will get new mail once its get approved by admin`,
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  sendEmail,
  forgetPassMailContent,
  registerEmailtoAdmin,
  registerEmailtoUser,
};

// const mailer = async (email, otp, callback) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.GMAIL_ID,
//       pass: process.env.GMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: process.env.GMAIL_ID,
//     to: email,
//     subject: `OTP Verification for Facegram`,
//     html: emailContent,
//   };

//   transporter.sendMail(mailOptions, (error) => {
//     if (error) {
//       console.error("Error sending email:", error);
//       callback(error);
//     } else {
//       console.log("Email sent");
//       callback(null);
//     }
//   });
// };
