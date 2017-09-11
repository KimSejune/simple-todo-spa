(function (window, document) {

  /**
   * 서버에서 할일 템플릿과 할일 데이터를 가져온 후, #todos 요소 안에 렌더링하는 함수
   */
  function loadTodos() {
    console.log('start loadTodos')
    render({
      // html의 id = todos인 곳이 target이다.
      target: '#todos',
      templatePath: '/templates/todos.ejs',
      dataPath: '/api/todos'
    }).then(todosEl => {
      todosEl.querySelectorAll('.todo-item').forEach(todoItem => {
        // dataset data-로 시작하는 모든 값이 저장된다.
        const id = todoItem.dataset.id

        // 체크박스 클릭시
        // 낙관적 업데이트
        const checkboxEl = todoItem.querySelector('.todo-checkbox')
        checkboxEl.addEventListener('click', e => {
          axios.patch(`/api/todos/${id}`, {
            complete: e.currentTarget.checked
          }).then(res => {
            loadTodos()
          })
        })

        // 삭제 아이콘 클릭시
        // 비관적 업데이트
        const removeLink = todoItem.querySelector('.todo-remove')
        removeLink.addEventListener('click', e => {
          axios.delete(`/api/todos/${id}`).then(res => {
            loadTodos()
          })
        })

        // 업데이트 아이콘 클릭시
        // 낙관적 업데이트
        const itemUpdate = todoItem.querySelector('.todo-item-update')
        const updateTodoItem = todoItem.querySelector('.todo-update')
        updateTodoItem.addEventListener('click', e => {
          axios.put(`/api/todos/${id}`, {
            title: itemUpdate.value
          }).then(res => {
            loadTodos()
          })
        })

      })
    })
  }

  document.querySelector('#todo-form').addEventListener('submit', e => {
    // e.stopPropagation() bulbbling을 멈춰버리게하는 작용
    // 기본동작을 취소하는 method이다. 즉 form의 기본동작인 submit인 전송을 취소한다.
    e.preventDefault()
    // event handler가 붙어있는요소인 form이 currentTarget이다.
    const form = e.currentTarget

    axios.post('/api/todos', {
      // name이나 혹은 id가 title로 되어있는 놈의 값은 이런식으로 가져올 수 있다.
      title: form.elements.title.value
    })
      .then(loadTodos)
      .then(() => {
        form.elements.title.value = null
        form.elements.title.focus()
      })
  })
  // 최초에 한번 form을 그려줘야하는 것.
  loadTodos()

})(window, document)
