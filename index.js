const http = require('http')
const path = require('path')
const fs = require('fs')

const server = http.createServer((req, res) => {
    const data = fs.readFileSync(path.join(__dirname, './app/templates/index.html'))
    res.statusCode = 200
    res.body = {
        data
    }

})
server.listen(8080, () => {
    console.log('server linsten on port 8080')
})
