import { existsSync, mkdir } from "fs";
import { getUploadLocation, getInstagramLocation } from "@/helpers/uploadLocations"

function ensureUserFolderExists(location: string): void {
  if (existsSync(location)) {
    return
  }
  mkdir(location, (err) => {
    if (err) {
      console.error(err.message)
      throw new Error(`Couldnt make a directory ${location}`)
    }
    console.log("Succesfully made initial upload directory")
  })
}


export function ensureUploadFoldersExist(): void {
  const instagramLocation = getInstagramLocation()
  const imageUploadLocation = getUploadLocation()
  ensureUserFolderExists(imageUploadLocation)
  ensureUserFolderExists(instagramLocation)
}

