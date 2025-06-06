import { readdirSync } from "fs"
import path from "path"
import { getInstagramLocation } from "@/helpers/useLocations"

export function getNewFileName(): string {
    const result = readdirSync(getInstagramLocation())

    // TODO: refactor this at some point its honestly kinda dumb
    const mapped = result.map(item => Number(path.parse(item).name))
    const sorted = mapped.sort((x, y) => x > y ? 1 : -1)

    const updatedFileName = Number(sorted.at(-1))

    if (!updatedFileName) return "1"

    return `${updatedFileName + 1}`
}

export function findNewestFile(): string {
    const result = readdirSync(getInstagramLocation())
    const sorted = result.sort((x, y) => {
        const xBaseName = Number(path.parse(x).name)
        const yBaseName = Number(path.parse(y).name)
        return xBaseName > yBaseName ? 1 : -1
    })
    return String(sorted.at(-1))
}


