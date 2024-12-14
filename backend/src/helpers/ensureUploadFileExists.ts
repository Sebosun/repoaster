import { existsSync, mkdir, PathLike } from "fs";
import { homedir } from "os";
import path from "path";

const home = homedir()

export function ensureUploadFileExists(): void {
  const uploadLocation = getUploadLocation()
  if (existsSync(uploadLocation)) {
    return
  }
  mkdir(getUploadLocation(), (err) => {
    if (err) {
      console.error(err.message)
      throw new Error("Couldnt make a directory")
    }
    console.log("Succesfully made initial upload directory")
  })
}

export function getUploadLocation(): string {
  return path.join(home, ".local", 'share', 'upload')
}
