import path from "path";
import { homedir } from "os";

const home = homedir()

export function getUploadLocation(): string {
  return path.join(home, ".local", 'share', 'upload')
}

export function getInstagramLocation(): string {
  return path.join(home, ".local", 'share', 'upload', 'instagram')
}
