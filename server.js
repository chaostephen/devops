const express = require('express')
const app = express()
const path = require('path')

app.use(express.json())
// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '7195f10d7e084036a0f592172e697121',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    rollbar.info('User has entered the main page...')
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/api/students', (req, res) => {
    rollbar.warning('List of students was requested')
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           rollbar.info(`New student as been added: ${name}`)
           res.status(200).send(students)
       } else if (name === ''){
        rollbar.error('Empty string was entered for new student.')
           res.status(400).send('You must enter a name.')
       } else {
        rollbar.error('Duplicate student name was entered.')
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
    rollbar.critical('Failed to add student!')
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
