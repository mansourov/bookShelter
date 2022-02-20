let formElement = document.getElementById('form-search')
let inputElement = document.getElementById('search-input')

formElement.addEventListener('submit', (evt)=> {
    evt.preventDefault()
    const titlefind = inputElement.value
      let foundedBooks = books.filter(book => book.volumeInfo.title.includes(titlefind))
      renderBooks(foundedBooks)
  })