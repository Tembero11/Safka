import { readdirSync, readFileSync, writeFileSync } from "fs";
import { micromark } from "micromark";

const getFileContents = (path) => {
  return readFileSync(path, { encoding: "utf-8" })
}

const appRoot = process.cwd()
readdirSync(`${appRoot}/docs`).forEach((docFile) => {
  const docFileFull = `${appRoot}/docs/${docFile}` // Prepend directory location to filename
  const asHtml = micromark(getFileContents(docFileFull))

  try {
    const docFileBase = docFile.split(".", 1)[0]
    writeFileSync(`${appRoot}/pages/${docFileBase}.html`, asHtml)
    console.log(`Succesfully wrote ${docFileBase}.html to /pages`)
  } catch (err) {
    console.log(err)
  }
})
