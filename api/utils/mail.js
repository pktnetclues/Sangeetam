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

const passChangeMailToUser = ({ name, email }) => {
  return {
    body: {
      name: name,
      intro: "Password Changed Successfully",
      action: [
        {
          instructions: `Hello ${name}, password for account ${email} has been changed successfully`,
          button: {
            color: "#22BC66",
            text: "Login",
            link: "http://localhost:5173/login",
            fallback: true,
          },
        },
      ],
    },
  };
};

const forgetPassMailContent = ({ name, forgetPassLink }) => {
  return {
    body: {
      name: name,
      intro: "We received a request to reset the password for your account.",
      action: [
        {
          instructions:
            "To reset your password, please click the button below. This link is valid for only 1 hour:",
          button: {
            color: "#22BC66",
            text: "Reset Password",
            link: forgetPassLink,
            fallback: true,
          },
        },
      ],
    },
  };
};

const registerEmailToAdmin = ({ name, email, dashboardLink }) => {
  return {
    body: {
      name: "Admin",
      intro: "Approval: New User Registration",
      table: {
        data: [
          {
            Name: name,
            Email: email,
          },
        ],
        columns: {
          // Optionally, customize the column widths
          customWidth: {
            Name: "20%",
            Email: "80%",
          },
          // Optionally, change column alignment
          customAlignment: {
            Name: "left",
            Email: "left",
          },
        },
      },
      action: [
        {
          instructions: "A new user has requested registration.",
          button: {
            color: "#22BC66",
            text: "Go to Dashboard",
            link: dashboardLink,
            fallback: true,
          },
        },
      ],
      outro:
        "Need help or have questions? Just reply to this email, and we'd be happy to assist you.",
    },
  };
};

const registerEmailToUser = ({ name }) => {
  return {
    body: {
      name: name,
      intro: "Thank you for creating an account.",
      action: [
        {
          instructions:
            "Your account has been sent for approval. Please wait for further instructions. You will receive a new email once it is approved by the admin.",
          button: [
            {
              text: "Visit our website",
              link: "https://example.com",
              fallback: true,
            },
          ],
        },
      ],
      outro:
        "Need help or have questions? Just reply to this email, and we'd be happy to assist you.",
    },
  };
};

const accountRejectedEmailToUser = ({ name }) => {
  return {
    body: {
      name: name,
      intro: "Unfortunatily! Your account has been Rejected.",
      action: [
        {
          instructions:
            "We are sorry to inform you your account has been rejected by admin. However you can again register",
          button: {
            color: "#22BC66",
            text: "Register again",
            link: "http://localhost:5173/register",
            fallback: true,
          },
        },
      ],
      outro:
        "Need help or have questions? Just reply to this email, and we'd be happy to assist you.",
    },
  };
};

const accountDeletedEmailToUser = ({ name, email }) => {
  return {
    body: {
      name: name,
      intro: "Notice!, Your account has been deleted by admin",
      action: [
        {
          instructions: `Hello ${name}, Unfortunatily your account with ${email} has been deleted by admin. however you can request for account recovery from admin`,
          button: {
            color: "#22BC66",
            text: "Go to homepage",
            link: "http://localhost:5173",
            fallback: true,
          },
        },
      ],
      outro:
        "Need help or have questions? Just reply to this email, and we'd be happy to assist you.",
    },
  };
};

const accountDeactivatedEmailToUser = ({ name, email }) => {
  return {
    body: {
      name: name,
      intro: "Notice! Your account has been De-Activated.",
      action: [
        {
          instructions: `Hello ${name}, sorry to inform you that your account with email: ${email} has been deactivated by admin`,
          button: {
            color: "#22BC66",
            text: "Go to Website",
            link: "http://localhost:5173",
            fallback: true,
          },
        },
      ],
      outro:
        "Need help or have questions? Just reply to this email, and we'd be happy to assist you.",
    },
  };
};
const accountActivatedEmailToUser = ({ name, email }) => {
  return {
    body: {
      name: name,
      intro: "Notice! Your account has been Activated.",
      action: [
        {
          instructions: `Hello ${name}, happy to inform you that your account with email: ${email} has been activated by admin`,
          button: {
            color: "#22BC66",
            text: "Go to Website",
            link: "http://localhost:5173",
            fallback: true,
          },
        },
      ],
      outro:
        "Need help or have questions? Just reply to this email, and we'd be happy to assist you.",
    },
  };
};

const contentUploadEmailToAdmin = ({ name, email, contentType }) => {
  return {
    body: {
      name: "Admin",
      intro: `New ${contentType} upload request`,
      action: [
        {
          instructions: `Hello admin, you have got an ${contentType} upload request from Name: ${name} and Email: ${email} `,
          button: {
            color: "#22BC66",
            text: "Go to dashboard",
            link: `http://localhost:5173/admin/pending-${contentType}s`,
            fallback: true,
          },
        },
      ],
      outro:
        "Need help or have questions? Just reply to this email, and we'd be happy to assist you.",
    },
  };
};

const accountApprovedEmailToUser = ({ name }) => {
  return {
    body: {
      name: name,
      intro: "Congratulations! Your account has been approved.",
      action: [
        {
          instructions:
            "You can now log in to your account using the link below:",
          button: {
            color: "#22BC66",
            text: "Log In to Your Account",
            link: "http://localhost:5173/login",
            fallback: true,
          },
        },
      ],
      outro:
        "Need help or have questions? Just reply to this email, and we'd be happy to assist you.",
    },
  };
};

const contentAccepted = ({ name }) => {
  return {
    body: {
      name: name,
      intro: "Congratulations! Your account has been approved.",
      action: [
        {
          instructions:
            "You can now log in to your account using the link below:",
          button: {
            color: "#22BC66",
            text: "Log In to Your Account",
            link: "http://localhost:5173/login",
            fallback: true,
          },
        },
      ],
      outro:
        "Need help or have questions? Just reply to this email, and we'd be happy to assist you.",
    },
  };
};

export {
  sendEmail,
  forgetPassMailContent,
  passChangeMailToUser,
  registerEmailToAdmin,
  registerEmailToUser,
  accountApprovedEmailToUser,
  accountRejectedEmailToUser,
  accountDeletedEmailToUser,
  accountDeactivatedEmailToUser,
  accountActivatedEmailToUser,
  contentUploadEmailToAdmin,
};
