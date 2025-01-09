const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send(`<h1>Hello!</h1>
                    <p><a href=./info/>Info</a></p>
                    <p>Go to <a href=./api/persons/>persons</a> for data.</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const people = persons.length
    const now = new Date()

    response.send(`<p>Phonebook has info for ${people} people.</p>
                   <p>${now}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end
})

const generateId = () => String(Math.floor(Math.random() * 1000000))

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            Error: 'Name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            Error: 'Number missing'
        })
    }

    if (persons.map(person => person.name).some(name => name === body.name)) {
        return response.status(409).json({
            Error: 'Name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})