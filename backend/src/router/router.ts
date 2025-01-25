import { Router } from "express";
import { upload } from "@/services/multer";
import { uploadImage } from "@/controllers/uploadImage";
import { sendDiscordMsg } from "@/controllers/sendDiscordMsg";
import { handleGetDiscordChannels } from "@/controllers/getDiscordChannels";
import { sendYTDLP } from "@/controllers/sendYTDLP";
import { getPresets, savePresets } from "@/controllers/presets"

const router = Router();

// TODO: Check out how to properly handle input validation
// I don't like manually checking it lol - zod?
router.get("/presets", getPresets);
router.post("/presets", savePresets);

router.post("/upload", upload.single("image"), uploadImage);
router.post("/message", sendDiscordMsg);
router.post("/ytdlp", sendYTDLP)
router.use("/channels", handleGetDiscordChannels);

export default router;
