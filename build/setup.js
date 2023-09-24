const YAML = require('yaml')
const fs = require('fs')

// let RP_BACKEND = process.env.RP_BACKEND


if (!fs.existsSync('/opt/rp/backends.yml')) {
  throw new Error(`Please setup "./conf/backends.yml" first`)
}

const file = fs.readFileSync('/opt/rp/backends.yml', 'utf8')
let yamlObject = YAML.parse(file)

let backends = yamlObject.backends

// if (RP_BACKEND.indexOf('|') === -1) {
//   rpBackendMap.push({
//     server_name: '_',
//     proxy_pass: RP_BACKEND
//   })
// }
// else {
//   RP_BACKEND.split('|').forEach((backendPair) => {
//     let pos = backendPair.indexOf(',')
//     if (pos === -1) {
//       throw new Error(`Multiple RP_BACKEND should include "|" and ","`)
//     }

    
//     let server_name = backendPair.slice(0, pos)
//     let proxy_pass = backendPair.slice(pos + 1)

//     if (proxy_pass.endsWith('/')) {
//       proxy_pass = proxy_pass.slice(0, -1)
//     }

//     rpBackendMap.push({
//       server_name,
//       proxy_pass
//     })
//   })
// }

let rpBackendMap = []
for (let i = 0; i < backends.length; i++) {
  if (typeof(backends[i]) === 'string') {
    rpBackendMap.push({
      server_name: '_',
      proxy_pass: backends[i]
    })
  }
  else {
    Object.keys(backends[i]).forEach((server_name) => {
      let proxy_pass = backends[i][server_name]
      rpBackendMap.push({
        server_name,
        proxy_pass
      })
    })
  }
} 

for (let i = 0; i < rpBackendMap.length; i++) {
  let {proxy_pass} = rpBackendMap[i]

  if (!Array.isArray(proxy_pass)) {
    proxy_pass = [proxy_pass]
  }

  proxy_pass = proxy_pass.map(backend => {
    if (backend.endsWith('/')) {
      backend = backend.slice(0, -1)
    }

    if (backend.startsWith('http://') || backend.startsWith('https://')) {
      backend = backend.slice(backend.indexOf('://') + 3)
    }
    return backend
  })

  rpBackendMap[i].proxy_pass = proxy_pass
}

// console.log(rpBackendMap)

// ==============================

const { execSync } = require("child_process")

for (let i = 0; i < rpBackendMap.length; i++) {
  let {server_name} = rpBackendMap[i]

  if (server_name === '_') {
    rpBackendMap[i].enable_https = false
    continue
  }

  // 先看看有沒有註冊
  try {
    let nslookupResult = execSync(`nslookup ${server_name}`)
    nslookupResult = nslookupResult.toString()
    if (nslookupResult.indexOf('Address: 127.0.0.1') > -1) {
      throw new Error(`${server_name} is localhost.`)
    }

    // 有註冊
    let pingResult = execSync(`ping -c 1 -t 10 ${server_name}`)
    pingResult = pingResult.toString()

    if (pingResult.indexOf('1 received') > -1) {
      console.log(`${server_name}'s server is online.`)

      // ===========
      // 檢查看看有沒有被佔用
      try {
        execSync(`curl --connect-timeout 5 http://${server_name}`)
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
    else {
      console.log(`${server_name}'s server is offline.`)

      rpBackendMap[i].enable_https = false
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

console.log(rpBackendMap)
return false
// throw new Error('Stop for debug')

// ==============================

// 準備來產生certbot使用的nginx.conf

// let httpServerTemplates = []
// let httpServerTemplate
// const fs = require('fs')

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
  execSync(`cp -f /opt/rp/nginx-certbot.conf /opt/rp/nginx/certbot/nginx.conf`)
  // let confTemplate = fs.readFileSync('/opt/rp/nginx-certbot.conf', 'utf8')
  // // confTemplate = confTemplate.replace(/\$\{http\-server\}/g, httpServerTemplates.join('\n'))

  // console.log(confTemplate)
  // fs.writeFileSync(`/opt/rp/nginx/certbot/nginx.conf`, confTemplate, 'utf-8')
  // execSync(`cp -f /opt/rp/nginx/certbot/nginx.conf /etc/nginx/nginx.conf`)

  // ================

  // console.log(`nginx for certbot is starting...`)
  // execSync(`/opt/rp/nginx/nginx-start.sh`)
  // execSync(`curl --connect-timeout 5 http://127.0.0.1`)
  
  // ================

  let tmpmail = execSync(`/tmpmail --generate`)
  tmpmail = tmpmail.toString().trim()
  console.log(`tmpmail: ${tmpmail}`)

  // ================

  let certbotCommands = []

  for (let i = 0; i < rpBackendMap.length; i++) {
    let {server_name, enable_https} = rpBackendMap[i]

    if (enable_https === false) {
      continue
    }

    if (fs.existsSync(`/etc/letsencrypt/live/${server_name}/fullchain.pem`)) {
      console.log(`/etc/letsencrypt/live/${server_name}/fullchain.pem is existed. skip.`)
      continue
    }

    certbotCommands.push(`/usr/bin/certbot certonly --webroot -w /var/www/certbot --force-renewal --email ${tmpmail} -d ${server_name} --agree-tos`)
  }

  // let certbotCommand = rpBackendMap.filter(rp => rp.enable_https === true)
  //     .map(rp => {
  //       // return rp.server_name
  //       return `/usr/bin/certbot certonly --webroot -w /var/www/certbot --force-renewal --email ${tmpmail} -d ${rp.server_name} --agree-tos`
  //     }).join('\n')

  // // let certbotCommand = `/usr/bin/certbot certonly --webroot -w /var/www/certbot --force-renewal --email ${tmpmail} -d ${domains} --agree-tos`
  // console.log(certbotCommand)

  if (certbotCommands.length > 0) {
    fs.writeFileSync(`/opt/rp/certbot-init.sh`, `#!/bin/bash\n` + certbotCommands.join('\n') + '\n', 'utf-8')
  }
  // execSync(certbotCommand)

  // // ================

  // console.log(`nginx for certbot is stoping...`)
  // execSync(`/opt/rp/nginx/nginx-stop.sh`)
}
else {
  if (fs.existsSync(`/opt/rp/nginx/certbot/nginx.conf`)) {
    fs.unlinkSync(`/opt/rp/nginx/certbot/nginx.conf`)
  }
  if (fs.existsSync(`/opt/rp/certbot-init.sh`)) {
    fs.unlinkSync(`/opt/rp/certbot-init.sh`)
  }
}

// ==============================

let serverTemplate = fs.readFileSync(`/opt/rp/nginx/rp/server.template`, 'utf-8')
let confTemplate = fs.readFileSync(`/opt/rp/nginx/rp/conf.template`, 'utf-8')
let httpServerTemplate = fs.readFileSync(`/opt/rp/nginx/rp/http-server.template`, 'utf-8')
let httpsServerTemplate = fs.readFileSync(`/opt/rp/nginx/rp/https-server.template`, 'utf-8')
// let upstreamTemplate = fs.readFileSync(`/opt/rp/nginx/rp/upstream.template`, 'utf-8')
let servers = []

for (let i = 0; i < rpBackendMap.length; i++) {
  let {server_name, proxy_pass, enable_https} = rpBackendMap[i]
  let backend_host = 'backend' + i

  let server = serverTemplate.replace(/\$\{server_name\}/g, server_name)
  server = server.replace(/\$\{server_name\}/g, server_name)
  server = server.replace(/\$\{backend_host\}/g, backend_host)
  // server = server.replace(/\$\{proxy_pass\}/g, proxy_pass)

  let backends = proxy_pass.map((backend) => {
    return `        server ${backend};`
  }).join('\n')

  let httpServer = httpServerTemplate.replace(/\$\{server\}/g, server)
  httpServer = httpServer.replace(/\$\{backend_host\}/g, backend_host)
  httpServer = httpServer.replace(/\$\{backends\}/g, backends)
  httpServer = httpServer.replace(/\$\{server_name\}/g, server_name)
  // httpServer = httpServer.replace(/\$\{proxy_pass\}/g, proxy_pass)
  servers.push(httpServer)

  if (enable_https) {
    let httpsServer = httpsServerTemplate.replace(/\$\{server\}/g, server)
    httpsServer = httpsServer.replace(/\$\{server_name\}/g, server_name)
    // httpsServer = httpsServer.replace(/\$\{proxy_pass\}/g, proxy_pass)
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
