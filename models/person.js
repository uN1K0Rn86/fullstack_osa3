const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('Connecting to', url)
mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB: ', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: (v) => {
                return /^\d{3}-\d{4,}$/.test(v) || /^\d{2}-\d{5,}$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number.`
        },
        required: [true, 'Phone number required']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
