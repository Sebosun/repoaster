import path from "path";
import { homedir } from "os";

const home = homedir()

// TODO: customizing the path

const FOLDER_NAME = "repoaster"

// Hoonestly, this is not ideal
// It could just sit in memory and we would just export the return values 
// - why call it each time? But it works so w/e for now

export function getUploadLocation(): string {
    return path.join(home, ".local", 'share', FOLDER_NAME)
}

export function getInstagramLocation(): string {
    return path.join(home, ".local", 'share', FOLDER_NAME, 'instagram')
}

export function getUserDataLocation(): string {
    return path.join(home, ".local", 'share', FOLDER_NAME, 'user_data.json')
}

export function getYTDLPLocation(file: string): string {
    return `${getInstagramLocation()}/${file}.%(ext)s`
}
