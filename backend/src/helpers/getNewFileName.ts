import { readdirSync } from "fs";
import path from "path";
import { getInstagramLocation } from "@/helpers/useLocations";
import { readdir, stat } from "fs/promises";

export function getNewFileName(): string {
  const result = readdirSync(getInstagramLocation());

  // TODO: refactor this at some point its honestly kinda dumb
  const mapped = result.map((item) => Number(path.parse(item).name));
  const sorted = mapped.sort((x, y) => (x > y ? 1 : -1));

  const updatedFileName = Number(sorted.at(-1));

  if (!updatedFileName) return "1";

  return `${updatedFileName + 1}`;
}

export const findNewestFile = async (): Promise<string> => {
  const folderLocation = getInstagramLocation();
  const files = await readdir(folderLocation);
  const acc = [] as { location: string; modifyTime: Date }[];
  for (const file of files) {
    const fileLocation = path.join(folderLocation, file);
    const result = await stat(fileLocation);
    acc.push({ location: file, modifyTime: result.ctime });
  }

  acc.sort((first, second) => {
    return Number(second.modifyTime) - Number(first.modifyTime);
  });

  if (!acc[0]) {
    throw new Error("No files found");
  }

  return path.join(folderLocation, acc[0].location);
};
