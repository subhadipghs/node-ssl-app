'use strict'

const os = require('os')
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const supportedPlatform = ['darwin', 'linux']
let keyFileName = 'key.pem'
let certFileName = 'cert.pem'
// default folder where to store the key and certificate
let folder = 'keys'


let endSignal = 0

try {
  if (!supportedPlatform.includes(os.platform())) {
    throw new Error(
      `Currently we only support ${supportedPlatform.join(
        ', '
      )} platform.\n ${os.platform()} is not yet supported`
    )
  }
  const existsDefaultFolder = fs.existsSync(path.join(process.cwd(), folder))

  if (!existsDefaultFolder) {
    console.log(`Generating ${folder} folder...`)
    const newFolderPath = path.join(process.cwd(), folder)
    const e = fs.mkdirSync(newFolderPath)
    if (e) {
      console.error('Oops! Sorry failed to create ' + folder + ' folder')
      process.exit(1)
    }
    console.log(`Generated ${folder} folder!`)
  }

  let pk = `./${folder}/${keyFileName}`
  let cp = `./${folder}/${certFileName}`

  // It uses prime256v1 algorithm
  // 1. Generate a key
  // 2. Generate certificate using that key
  let cmds = [
    `sudo openssl ecparam -out ${pk} -name prime256v1 -genkey`,
    `sudo openssl req -new -key ${pk} -x509 -nodes -days 365 -out ${cp}`
  ]

  cmds.forEach((c) => {
    const err = spawnSync(c, { stdio: 'inherit', shell: true })
    if (err && err.status !== 0) {
      console.error('Oops! Unexpected problem occured while generating keys')
      throw new Error(e)
    }
  })

  console.log(
    'Great! Private key and certificate have been generated successfully'
  )
} catch (e) {
  endSignal = 1
  console.error(e)
}

process.exit(endSignal)
