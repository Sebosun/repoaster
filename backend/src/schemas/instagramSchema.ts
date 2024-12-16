import { z } from "zod";

const REELS_REGEX = /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/reels\/(\w+)/
const regex = (value: string) => REELS_REGEX.test(value ?? "")
const instagramSchema = z.object({
  link: z.string().url(),
  channels: z.array(z.string()),
});

export { instagramSchema };
