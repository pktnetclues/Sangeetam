import { audioSchema } from "../schema/user.schema.js";

const uploadAudio = async (req, res) => {
  try {
    await audioSchema.validate(req.body, { abortEarly: false });
    const { album, singerName, writerName } = req.body;
    const uploadedBy = req.user.userId;

    const files = req.files;

    console.log(uploadedBy);
    console.log(files);

    return res.status(200).json({ uploadedBy, files });
  } catch (error) {}
};

export { uploadAudio };
