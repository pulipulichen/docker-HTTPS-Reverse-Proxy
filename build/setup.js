let RP_BACKEND = process.env.RP_BACKEND

if (!RP_BACKEND) {
  throw new Error(`Please setup "RP_BACKEND" in "docker-compose.yml"`)
}

let rpBackendMap = []
if (RP_BACKEND.indexOf('|') === -1) {
  rpBackendMap.push({
    server_name: '_',
    proxy_pass: RP_BACKEND
  })
}
else {
  RP_BACKEND.split('|').forEach((backendPair) => {
    let pos = backendPair.indexOf(',')
    if (pos === -1) {
      throw new Error(`Multiple RP_BACKEND should include "|" and ","`)
    }

    
    let server_name = backendPair.slice(0, pos)
    let proxy_pass = backendPair.slice(pos + 1)

    if (proxy_pass.endsWith('/')) {
      proxy_pass = proxy_pass.slice(0, -1)
    }

    rpBackendMap.push({
      server_name,
      proxy_pass
    })
  })
}


// console.log(rpBackendMap)

// ==============================

const { execSync } = require("child_process")

for (let i = 0; i < rpBackendMap.length; i++) {
  let {server_name, proxy_pass} = rpBackendMap[i]

  if (server_name === '_') {
    rpBackendMap[i].enable_https = false
    continue
  }

  // 先看看有沒有註冊
  try {
    execSync(`nslookup ${server_name}`)

    // 有註冊

    // ===========
    // 檢查看看有沒有被佔用
    try {
      execSync(`curl http://${server_name}`)
      console.log(`${server_name} is running. Stop it before you want to running reverse proxy.`)

      // 有被佔用
      rpBackendMap[i].enable_https = false
      continue
    }
    catch (e) {
      // 沒有被佔用
      console.log(`${server_name} is ready for certbot.`)

      rpBackendMap[i].enable_https = true
      continue
    }

  }
  catch (e) {
    // 沒有註冊
    rpBackendMap[i].enable_https = false
    continue
  }
  // let nslookupResult = execSync(`nslookup ${server_name}`)
  // console.log(nslookupResult.toString())
}

// console.log(rpBackendMap)

// ==============================

// 準備來產生certbot使用的nginx.conf

// let httpServerTemplates = []
// let httpServerTemplate
const fs = require('fs')

// for (let i = 0; i < rpBackendMap.length; i++) {
//   if (rpBackendMap[i].enable_https === false) {
//     continue
//   }

//   let {server_name} = rpBackendMap[i]

//   if (!httpServerTemplate) {
//     httpServerTemplate = fs.readFileSync('/opt/rp/nginx/certbot/http-server.template', 'utf8')
//   }

//   // let hst = httpServerTemplate.replace(/\$\{server_name\}/g, server_name)
//   // httpServerTemplates.push(hst)
// }

if (rpBackendMap.filter(rp => rp.enable_https === true).length > 0) {
  let confTemplate = fs.readFileSync('/opt/rp/nginx-certbot.conf', 'utf8')
  // confTemplate = confTemplate.replace(/\$\{http\-server\}/g, httpServerTemplates.join('\n'))

  console.log(confTemplate)
  fs.writeFileSync(`/opt/rp/nginx/certbot/nginx.conf`, confTemplate, 'utf-8')
  // execSync(`cp -f /opt/rp/nginx/certbot/nginx.conf /etc/nginx/nginx.conf`)

  // ================

  // console.log(`nginx for certbot is starting...`)
  // execSync(`/opt/rp/nginx/nginx-start.sh`)
  // execSync(`curl http://127.0.0.1`)
  
  // ================

  let tmpmail = execSync(`/tmpmail --generate`)
  tmpmail = tmpmail.toString().trim()
  console.log(`tmpmail: ${tmpmail}`)

  // ================

  let certbotCommand = rpBackendMap.filter(rp => rp.enable_https === true)
      .map(rp => {
        // return rp.server_name
        return `/usr/bin/certbot certonly --webroot -w /var/www/certbot --force-renewal --email ${tmpmail} -d ${rp.server_name} --agree-tos`
      }).join('\n')

  // let certbotCommand = `/usr/bin/certbot certonly --webroot -w /var/www/certbot --force-renewal --email ${tmpmail} -d ${domains} --agree-tos`
  console.log(certbotCommand)
  fs.writeFileSync(`/opt/rp/certbot-init.sh`, `#!/bin/bash\n` + certbotCommand + '\n', 'utf-8')
  // execSync(certbotCommand)

  // // ================

  // console.log(`nginx for certbot is stoping...`)
  // execSync(`/opt/rp/nginx/nginx-stop.sh`)
}
else if (fs.existsSync(`/opt/rp/nginx/certbot/nginx.conf`)) {
  fs.unlinkSync(`/opt/rp/nginx/certbot/nginx.conf`)
}

// ==============================

let confTemplate = fs.readFileSync(`/opt/rp/nginx/rp/conf.template`, 'utf-8')
let httpServerTemplate = fs.readFileSync(`/opt/rp/nginx/rp/http-server.template`, 'utf-8')
let httpsServerTemplate = fs.readFileSync(`/opt/rp/nginx/rp/https-server.template`, 'utf-8')
let servers = []

for (let i = 0; i < rpBackendMap.length; i++) {
  let {server_name, proxy_pass, enable_https} = rpBackendMap[i]

  let httpServer = httpServerTemplate.replace(/\$\{server_name\}/g, server_name)
  httpServer = httpServer.replace(/\$\{proxy_pass\}/g, proxy_pass)

  servers.push(httpServer)

  if (enable_https) {
    let httpsServer = httpsServerTemplate.replace(/\$\{server_name\}/g, server_name)
    httpsServer = httpsServer.replace(/\$\{proxy_pass\}/g, proxy_pass)

    servers.push(httpsServer)
  }
}

if (servers.length === 0) {
  throw new Error('Servers configuration error!')
}

confTemplate = confTemplate.replace(/\$\{servers\}/g, servers.join('\n\n'))
fs.writeFileSync(`/opt/rp/nginx/rp/nginx.conf`, confTemplate, `utf-8`)

// ==============================


// throw new Error(`test`)
// execSync(`cat /opt/rp/nginx/rp/nginx.conf`)
// execSync(`cat /opt/rp/certbot-init.sh`)

// process.exit(64)
