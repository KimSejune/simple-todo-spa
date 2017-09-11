const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const data = require('./data')

const app = express()
const jsonMiddleware = bodyParser.json()

app.use(morgan('tiny'))
app.use(express.static('public'))

app.get('/api/todos', (req, res) => {
  // data.js에 있는 todos를 json 형식으로 보낸다.
  res.send(data.todos)
})

app.post('/api/todos', jsonMiddleware, (req, res) => {
  const {title} = req.body

  if (title) {
    const todo = data.addTodo({title})
    res.send(todo)
  } else {
    res.status(400)
    res.end()
  }
})

// 값을 추가해주는 명령
app.patch('/api/todos/:id', jsonMiddleware, (req, res) => {
  let id;
  try {
    id = parseInt(req.params.id)
  } catch (e) {
    res.status(400)
    res.end()
    return // 바로 라우트 핸들러를 종료합니다.
  }
  const todo = data.updateTodo(id, req.body)
  res.send(todo)
})

app.delete('/api/todos/:id', jsonMiddleware, (req, res) => {
  let id;
  try {
    id = parseInt(req.params.id)
  } catch (e) {
    res.status(400)
    res.end()
    return // 바로 라우트 핸들러를 종료합니다.
  }
  data.deleteTodo(id)
  res.end()
})

app.put('/api/todos/:id', jsonMiddleware, (req, res) => {
  let id;
  const changeTitle = req.body.title
  try {
    id = parseInt(req.params.id)
  }catch(e){
    res.status(400)
    res.end()
    return
  }

  const todo = data.updateTodoItem(id, changeTitle)
  res.send(todo)
})

app.listen(3000, () => {
  console.log('listening...')
})
