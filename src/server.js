const express = require('express')
const server = express()
const db = require('./db/db')


// servindo arquivos estaticos 
server.use(express.static('src/public'))

// habilitando req.body 
server.use(express.urlencoded({ extended: true }))

// configurando o nunjucks
const nunjucks = require('nunjucks')
nunjucks.configure('src/public/views', { express: server, noCache: true })


// criando as rotas
server.get('/', (req, res) => {

    // consultar dados na tabela 
    db.all(`SELECT * FROM ideas`, function (err, rows) {
        if (err) {
            console.log(err)
            res.send('Erro no banco de dados!')
        }

        const reversedIdeas = [...rows].reverse()
        let lastIdeas = []

        for (const idea of reversedIdeas) {
            if (lastIdeas.length < 2) {
                lastIdeas.push(idea)
            }
        }

        return res.render('index.html', { ideas: lastIdeas })
    })
})

server.get('/ideias', (req, res) => {
    // consultar dados na tabela 
    db.all(`SELECT * FROM ideas`, function (err, rows) {
        if (err) {
            console.log(err)
            res.send('Erro no banco de dados!')
        }

        return res.render('ideias.html', { ideas: [...rows].reverse() })
    })
})

server.post('/', (req, res) => {
    console.log(req.body)

    // inserir dado na tabela 
    const query = `
        INSERT INTO 
        ideas(image, title, category, description, link) 
        VALUES (?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]

    db.run(query, values, function (err) {
        if (err) {
            console.log(err)
            res.send('Erro no banco de dados!')
        }

        return res.redirect('/ideias')
    })
})


// servindo a aplicacao 
server.listen(3001, () => console.log('> Servidor rodando na porta: 3001'))
