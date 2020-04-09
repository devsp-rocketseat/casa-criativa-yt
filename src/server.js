const express = require('express')
const server = express()


// servindo arquivos estaticos 
server.use(express.static('src/public'))


// habilitando req.body 
server.use(express.urlencoded({ extended: true }))


// configurando o nunjucks
const nunjucks = require('nunjucks')
nunjucks.configure('src/public/views', { express: server, noCache: true })


// configurando as rotas
server.use(require('./routes'))


// servindo a aplicacao 
server.listen(3001, () => console.log('> Servidor rodando na porta: 3001'))
