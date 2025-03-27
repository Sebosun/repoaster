import { existsSync, mkdir, writeFile } from "fs";
import { getUploadLocation, getInstagramLocation, getUserDataLocation } from "@/helpers/useLocations"

function ensureUserFolderExists(location: string): void {
    if (existsSync(location)) return
    mkdir(location, (err) => {
        if (err) {
            console.error(err.message)
            throw new Error(`Couldnt make a directory ${location}`)
        }
        console.log("Succesfully made initial upload directory")
    })
}

function ensureUserDataFileExists(): void {
    const userDataLocation = getUserDataLocation()

    const exists = existsSync(userDataLocation)
    if (exists) return

    const data = JSON.stringify({})
    writeFile(userDataLocation, data, 'utf-8', (error) => {
        if (error) {
            console.error(error.message)
            throw new Error(`Couldnt make a file ${userDataLocation}`)
        }
        console.log("Succesfully made initial user data file")
    })
}

export function ensureUploadFoldersExist(): void {
    const imageUploadLocation = getUploadLocation()
    const instagramLocation = getInstagramLocation()
    ensureUserFolderExists(imageUploadLocation)
    ensureUserFolderExists(instagramLocation)
    ensureUserDataFileExists()
}

