import { z } from "zod";

const repostChannelsSchema =
    z.object({
        channels: z.array(z.string()),
    });

export { repostChannelsSchema };
