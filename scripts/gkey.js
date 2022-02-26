'use strict'

const os = require('os')
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const supportedPlatform = ['darwin', 'linux']

let endSignal = 0

try {
  if (!supportedPlatform.includes(os.platform())) {
    throw new Error(
      `Currently we only support ${supportedPlatform.join(
        ', '
      )} platform.\n ${os.platform()} is not yet supported`
    )
  }
  // default folder where to store the key and certificate
  let defaultFolder = 'keys'

  const existsDefaultFolder = fs.existsSync(path.join(process.cwd(), defaultFolder))

  if (!existsDefaultFolder) {
    console.log(`Generating ${defaultFolder} folder...`)
    const newFolderPath = path.join(process.cwd(), defaultFolder)
    const e = fs.mkdirSync(newFolderPath)
    if (e) {
      console.error('Oops! Sorry failed to create ' + defaultFolder + ' folder')
      process.exit(1)
    }
    console.log(`Generated ${defaultFolder} folder!`)
  }

  const cmd = (folder = defaultFolder) => {
    let pk = `./${folder}/private.key`
    let cp = `./${folder}/certificate.crt`
    return `sudo openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout ${pk} -out ${cp}`
  }

  const err = spawnSync(cmd(), { stdio: 'inherit', shell: true })

  if (err && err.status !== 0) {
    console.error('Oops! Unexpected problem occured while generating keys')
    throw new Error(e)
  } 
  console.log(
    'Great! Private key and certificate have been generated successfully'
  )
} catch (e) {
  endSignal = 1
  console.error(e)
}

process.exit(endSignal)
