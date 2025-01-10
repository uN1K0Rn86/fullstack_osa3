require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

app.get('/', (request, response) => {
    response.send(`<h1>Hello!</h1>
                    <p><a href=./info/>Info</a></p>
                    <p>Go to <a href=./api/persons/>persons</a> for data.</p>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person =>{
            response.json(person)
        })
})

app.get('/info', (request, response) => {
    const people = persons.length
    const now = new Date()

    response.send(`<p>Phonebook has info for ${people} people.</p>
                   <p>${now}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
})

const generateId = () => String(Math.floor(Math.random() * 1000000000000000000000000))

app.post('/api/persons', async (request, response) => {
    const body = request.body

    if (body.name === '') {
        return response.status(400).json({
            Error: 'Name missing'
        })
    }

    if (body.number === '') {
        return response.status(400).json({
            Error: 'Number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})