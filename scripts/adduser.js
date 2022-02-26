'use strict'

const os = require('os')
const path = require('path')
const {existsSync} = require('fs')
const { spawnSync, execSync } = require('child_process')


let group = 'certificate-reader-group'
let keyFileName = 'key.pem'
let certFileName = 'cert.pem'
// default folder where to store the key and certificate
let folder = 'keys'
let key = `./${folder}/${keyFileName}`
let cert = `./${folder}/${certFileName}`
let supported = 'linux'
let files = [keyFileName, certFileName]


try {
  if (os.platform() === supported) {
    let user = execSync('whoami').toString().replace('\n', '')
    files.forEach(f => {
      // check whether the files exists or not
      const ex = existsSync(path.join(process.cwd(), folder, f))
      if (!ex) {
        throw new Error(
          'Oops! ' + f + ' does not exists'
        )
      }
    })
    // 1. create a group that has the permission to read the key files
    // 2. add the current user to that group
    // 3. Add the ownership to the current user
    let cmds = [
      `sudo groupadd ${group}`,
      `sudo usermod ${user} -a -G ${group}`,
      `sudo chown ${user}.${group} ${key} ${cert}`,
    ]
    // run each commands synchronously
    cmds.forEach(c => {
      let e = spawnSync(c, { shell: true, stdio: 'inherit' }).stderr
      if (e && e.status !== 0) {
        console.log(`Something went wrong! ${c}`)
      } else {
        console.log(`${c} is successfully executed`)
      }
    })
  }
} catch (e) {
  console.error(e)
}

// exit the process
process.exit()
