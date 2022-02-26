"use strict"

import e from "express"
import fs from "node:fs"
import https from "node:https"
import path from "node:path"

const app = e()

app.get("/", function (req, res) {
  return res.status(200)
    .json({
      ok: true, 
      message: "yeppy! it is working 🐙" 
    })
})

const sslPath = path.join(process.cwd(), "keys")

const opts = {
  key: fs.readFileSync(path.join(sslPath, "private.key")).toString("utf-8"),
  cert: fs
    .readFileSync(path.join(sslPath, "certificate.crt"))
    .toString("utf-8"),
}

const server = https.createServer(opts, app)

server.listen(8443, () => console.log("App is running on *:8443"))
