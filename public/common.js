function render({ target, templatePath, dataPath, queryFrom = document }) {
  // 템플릿 가져오기
  const templatePromise = axios.get(templatePath)

  // 데이터 가져오기
  const dataPromise = axios.get(dataPath)

  // 둘다 완료되면... 템플릿과 데이터가 둘다 끊나야 사용가능
  // promise.all은 새로운 pormise를 만드는데 그 promise가 성공하는 조건은 안의
  // 모든 값이 성공해야지 실행된다.
  return Promise.all([templatePromise, dataPromise])
  // 값을 배열로 묶어서 성공시킨다.
    .then(([templateRes, dataRes]) => {
      // 템플릿 렌더링하기
      const html = ejs.render(templateRes.data, {
        todos: dataRes.data
      })

      // 렌더링 결과를 문서에 주입하기
      const targetEl = queryFrom.querySelector(target)
      targetEl.innerHTML = html
      return targetEl
    })

  // 위에서 Promise를 반환하고 있기 때문에 render 함수의 반환값(tragetEl)에 `.then`을 이어붙일 수 있습니다.

}
