// {{ START Standard API Imports

const dns   = require('dns')
const https = require('https')
const net   = require('net')

// }} END Standard API Imports


// {{ START Variables

const usage = 'usage: wgb [-h|--help || target]'

// }} END Variables


// {{ START Functions

const resolve_ip = (domain) => {
    return new Promise((resolve, reject) => {
        dns.lookup(domain, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(data)
        })
    })
}

const fetch_geo_info = (ip_addr) => {
    const opts = {
        hostname: 'ipinfo.io',
        port: 443,
        path: `${ip_addr}/geo`,
        method: 'GET'
    }

    const req = https.request(opts, res => {
        res.on('data', data => {
            process.stdout.write(data)
        })
    })
    req.end()

    req.on('error', err => {
        console.error(err)
        process.exit(3)
    })
}

const main = () => {
    if (process.argv.length != 3) {
        console.error(usage)
        process.exit(1)
    } else if (process.argv[2] == '-h' || process.argv[2] == '--help') {
        console.log(usage)
        process.exit(0)
    }

    const target = process.argv[2]
    if (net.isIP(target) == 0) {
        resolve_ip(target)
            .then(target_as_ip => fetch_geo_info(target_as_ip))
            .catch(err => console.error(err))
        process.exit(2)
    } else {
        fetch_geo_info(target)
    }
}

// }} END Functions


// {{ START Exports

module.exports = main

// }} END Exports
