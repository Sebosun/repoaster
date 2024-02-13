import { z } from "zod";

const messageSchema = z.object({
  message: z.string(),
  channels: z.array(z.string()),
});

export { messageSchema };
