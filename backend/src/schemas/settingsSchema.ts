import { z } from "zod";

export const settingsSchema = z.object({
    presets:
        z.array(
            z.object({
                name: z.string(),
                channels: z.array(z.string()),
            })).optional(),
    repoastChannels: z.array(z.string()).optional(),
});
