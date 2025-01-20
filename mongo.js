const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please give your password as an argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://heinisam:${password}@un1k0rn.drd0a.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=uN1K0Rn`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person
        .find({})
        .then(result => {
            console.log('Phonebook')
            result.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person
        .save()
        .then(() => {
            console.log(`Added ${person.name} number ${person.number} to phonebook.`)
            mongoose.connection.close()
        })
}