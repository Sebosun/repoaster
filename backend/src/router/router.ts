import { Router } from "express";
import { upload } from "@/services/multer";
import { handleUploadImage } from "@/controllers/handleUploadImage";
import { handleSendDiscordMsg } from "@/controllers/handleSendDiscordMsg";
import { handleGetDiscordChannels } from "@/controllers/handleGetDiscordChannels";

const router = Router();

// TODO: Check out how to properly handle input validation
// I don't like manually checking it lol - zod?
router.post("/upload", upload.single("image"), handleUploadImage);
router.post("/message", handleSendDiscordMsg);
router.use("/channels", handleGetDiscordChannels);

export default router;
