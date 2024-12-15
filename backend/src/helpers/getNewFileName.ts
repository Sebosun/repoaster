import { readdirSync } from "fs"
import path from "path"
import { getInstagramLocation } from "@/helpers/uploadLocations"

export function getNewFileName(): string {
  const result = readdirSync(getInstagramLocation())

  // TODO: refactor this at some point its honestly kinda dumb
  const mapped = result.map(item => Number(path.parse(item).name))
  const sorted = mapped.sort((x, y) => x > y ? 1 : -1)

  const newName = Number(sorted[sorted.length - 1])
  if (!newName) {
    throw new Error("Couldn't find new filename")
  }

  return `${newName + 1}`
}
