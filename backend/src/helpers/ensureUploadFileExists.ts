import { existsSync, writeFile } from "fs";
import { mkdir } from "node:fs/promises";
import { getUploadLocation, getInstagramLocation, getUserDataLocation } from "@/helpers/useLocations"

export async function ensureUserFolderExists(location: string): Promise<void> {
    if (existsSync(location)) return
    try {
        await mkdir(location)
        console.log(`Succesfully made folder ${location}`)
    } catch (e) {
        console.error(e)
        throw new Error(`Couldn't make a directory ${location}`)
    }
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

export async function ensureUploadFoldersExist(): Promise<void> {
    const imageUploadLocation = getUploadLocation()
    const instagramLocation = getInstagramLocation()
    // Those throws - and they should break the app if they're broken
    ensureUserFolderExists(imageUploadLocation).then(() => {
        ensureUserFolderExists(instagramLocation)
        ensureUserDataFileExists()
    })
}

