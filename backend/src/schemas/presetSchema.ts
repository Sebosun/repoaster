import { z } from "zod";

const presetSchema =
    z.array(
        z.object({
            name: z.string(),
            channels: z.array(z.string()),
        }));

export { presetSchema };
