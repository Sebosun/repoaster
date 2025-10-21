import { findNewestFile, getNewFileName } from "@/helpers/getNewFileName";
import { getInstagramLocation, getYTDLPLocation } from "@/helpers/useLocations";
import { logger } from "@/server";
import { spawn } from "child_process";
import path from "path";

export type CallbackType = (
  code: number | null,
  filePath: string,
  nameAsFile: string,
) => Promise<void> | void;

const maxSize = 8;
const maxFileSize = `${maxSize}M`;

export async function ytdlp(
  link: string,
  callback: CallbackType,
): Promise<void> {
  // TODO: new approach - we download file whatever it is, with max file size 500MB+
  // We then check the file on the drive, if it's not a video or is bigger than 8mb
  // we send an error on endpoint and delete the file from the drive.
  // Alternative approach is to create some microservice with python and use yt-dlp there cause we will get mroe info
  // but i cant be bothered and deplyoing this to raspberry pi sounds like a chore and bore and horrible

  const isEnough = await getFileApproximateSize(link);
  if (!isEnough) {
    return;
  }

  const fileName = getNewFileName();
  const ytDLPPath = getYTDLPLocation(fileName);
  const ls = spawn("yt-dlp", [
    "--max-filesize",
    maxFileSize,
    "-o",
    ytDLPPath,
    link,
  ]);

  ls.on("close", async (code) => {
    const readdirFilename = await findNewestFile();
    const filePath = path.join(getInstagramLocation(), readdirFilename);
    logger.info({ fileName, code }, "Spawned process closes");
    callback(code, filePath, readdirFilename);
  });
}

function getFileApproximateSize(link: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // will approximate file size into stdout
    const ls = spawn("yt-dlp", [link, "-O", "filesize_approx"]);
    let output = "";
    ls.stdout.setEncoding("utf8");
    ls.stdout.on("data", (data) => {
      output += String(data);
    });

    ls.on("close", () => {
      const isOutputNan = Number.isNaN(Number(output));
      const maxMB = 8 * 1024 * 1024;

      if (isOutputNan) {
        reject("Invalid yt-dlp response");
      }
      const meetsLimit = maxMB > Number(output);
      resolve(meetsLimit);
    });

    setTimeout(() => {
      // exitcode is null when it's still running
      const isStrillRunning = Object.is(null, ls.exitCode);
      if (isStrillRunning) {
        ls.kill();
        reject("Child running for too long");
      }
    }, 5000);

    ls.on("exit", (err) => {
      reject(err);
    });

    ls.on("error", (err) => {
      reject(err);
    });
  });
}
