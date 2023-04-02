import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { micromark } from "micromark";

const getFileContents = (path) => {
  return readFileSync(path, { encoding: "utf-8" })
}

const appRoot = process.cwd() // Figure out root for next.js app (directory with package.json)

try {
  rmSync(`${appRoot}/pages/docs`, { recursive: true }) // Remove existing .html files to update them with fresh ones
  console.log("Deleted /pages/docs succesfully\n")
  mkdirSync(`${appRoot}/pages/docs`)
} catch (err) {
  console.log("Deletion of a docs file didn't succeed, error: ", err)
}

// Iterate over markdown files and compile them to html
readdirSync(`${appRoot}/docs`).forEach((docFile) => {
  const docFileFull = `${appRoot}/docs/${docFile}` // Prepend directory location to filename
  const htmlOutput = micromark(getFileContents(docFileFull))

  // Write html output to files
  // Next.js will include these on it's routing system
  try {
    const docFileBase = docFile.split(".", 1)[0]
    writeFileSync(`${appRoot}/pages/docs/${docFileBase}.html`, htmlOutput)
    console.log(`Succesfully wrote ${docFileBase}.html to /pages/docs`)
  } catch (err) {
    console.log(err)
  }
})
