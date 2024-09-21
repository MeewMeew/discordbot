import { Signale } from "signale"
import fs from 'node:fs'

const log = new Signale({ scope: "Distube Fixer" })
try {
  const path = process.cwd() + '/node_modules/distube/dist/index.js'
  const fileContent = fs.readFileSync(path, 'utf-8')
  log.info("File loaded")

  const newContent = fileContent
    .replace(
      'opts.i = fileUrl.hostname + fileUrl.pathname;',
      'opts.i = fileUrl.hostname + fileUrl.pathname.slice(1);'
    )

  fs.writeFileSync(path, newContent)
  log.success("Distube fixed")
} catch (error: any) {
  log.error(error)
}