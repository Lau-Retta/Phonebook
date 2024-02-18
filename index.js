const express = require('express')
const app = express()
const cors = require('cors')

var morgan = require('morgan')

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors())

morgan.token('postData', function(req, res) {
  if (req.method === 'POST') {
      return JSON.stringify(req.body); 
  }
  return '';
});

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :postData'));


let persons =[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

  app.get('/info',(request, response) => {
    const currentDate = new Date();
    response.send(`<div> 
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentDate}</p> 
    </div>`)
   
  }) 

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })
  
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(per => per.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(per => per.id === id)
    if (person) {
      persons = persons.filter(per => per.id !== id)  
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  })



  const generateId = () => {
    const randomNumber = Math.random() * 100000;
    const randomId = Math.floor(randomNumber);
   
    return randomId;
  }
  
  app.post('/api/persons', (request, response) => {

    const body = request.body

    
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }else if(!body.number){
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }
    
    if(persons.find(per => per.name === body.name) ){
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }else if(persons.find(per => per.number === body.number)){
      return response.status(400).json({ 
        error: 'number must be unique' 
      })
    }
    
    const person = {
      name: body.name,
      number: body.number ,
      id: generateId()
    }
  
    persons = persons.concat(person)
  
    response.json(persons)
  })


  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })