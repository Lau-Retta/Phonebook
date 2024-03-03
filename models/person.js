require('dotenv').config();
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI;

console.log('connecting to', url)


mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

function validatePhoneNumber(phoneNumber) {
  const phoneRegex = /^(\d{2,3})-(\d+)$/;
  return phoneRegex.test(phoneNumber);
}
  

const personSchema = new mongoose.Schema({
  name: {
    type:String,
    minLength: 3,
    required: true  
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: validatePhoneNumber,
      message: "The phone number must be in the correct format (e.g. 09-1234567)"
    }
  },
}) 

personSchema.set('toJSON', {
    transform: (document,  returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


// if(process.argv.length===5){
//   const person = new Person({
//     name: process.argv[3],
//     number: process.argv[4],
//   }) 

//   person.save().then(result => {
//       console.log(`added ${person.name} number ${person.number} to phonebook`)
//       mongoose.connection.close()
//   })
// }
// if(process.argv.length===3){
  
//   Person.find({}).then(result => {
//     console.log("phonebook:");
//     result.forEach(person => {
//       console.log(person?.name ,person?.number)
//     })
//     mongoose.connection.close()
//   })
// }

module.exports = mongoose.model('person', personSchema)