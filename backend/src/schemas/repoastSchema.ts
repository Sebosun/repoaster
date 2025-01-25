import { z } from "zod";

const repoastSchema = z.object({
    link: z.string().url(),
})

export { repoastSchema };
