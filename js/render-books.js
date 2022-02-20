let searchInputEl = document.getElementById('search-input')
let booksCard = document.getElementById('books-card')
let booksTemplate = document.getElementById('books-template').content

let modalBox = document.getElementById('modal-box')
let modalTemplate = document.getElementById('modal-template').content
let showResult = document.querySelector('.amount__result')
var pageCount = document.querySelector('.pageCount')
var pagelinkPrev = document.querySelector('.pagePrev')
var pagelinkNext = document.querySelector('.pageNext')
let pageDot = document.getElementById('pagedot')

var currentPage = 1
pagelinkPrev.textContent = '<'

// pagination
window.addEventListener('click', (event)=>{
    var pageEl = event.target
    if(pageEl.dataset.task=="paginationbtnPrev"){

        if(currentPage>1){
            currentPage-=1
            booksApi().then(()=> {
                renderBooks(booksCard)
            })
            renderPage()
        }
    }
    if(pageEl.dataset.task=="paginationbtnNext"){
        if(currentPage<Math.ceil(response.totalItems/10)){
            currentPage+=1
            booksApi().then(()=> {
                renderBooks(booksCard)
            })
            renderPage()
        }
        if(currentPage == 1){
            pagelinkPrev.classList.add('disabled')
        }else{
            pagelinkPrev.classList.remove('disabled')
        }
    
        if(currentPage == Math.ceil(books/10)){
            pagelinkNext.classList.add('disabled')
        }else{
            pagelinkNext.classList.remove('disabled')
        }
    }    
})

let page1 = document.querySelector('.per_page1')
let page2 = document.querySelector('.per_page2')
let page3 = document.querySelector('.per_page3')
let page4 = document.querySelector('.per_page4')
function renderPage(){
    response.totalItems
    if(currentPage == Math.ceil(books/10)-5){
        pageDot.remove()
    }
    if(Math.ceil(books/10) > 4){
        page1.textContent = currentPage
        page1.dataset.page = currentPage

        page2.textContent = Number(currentPage)+1
        page2.dataset.page = Number(currentPage)+1

        page3.textContent = Math.ceil(books/10)-1
        page3.dataset.page = Math.ceil(books/10)-1
        
        page4.textContent = Math.ceil(books/10)
        page4.dataset.page = Math.ceil(books/10)
    }
}

function getBookmarks(){
    const bookMarks = localStorage.getItem('bookmark')
    return bookMarks ?  JSON.parse(bookMarks) : []
}

function getBooksById(bookMarks){
    const booksAll = bookMarks.map((element)=> {
        return books.find(book => book.id == element)
    })
    console.log(booksAll);
    return booksAll
}

function addBookmark(id){
    const bookMarks = getBookmarks()
    if(!bookMarks.includes(id)){
        bookMarks.push(id)
    }
    setBookmarks(bookMarks)
}

function setBookmarks(data){
    localStorage.setItem('bookmark', JSON.stringify(data))
}

//delete bookmarks
function deleteBookMarks(id) {
    const bookMarks = getBookmarks()
    const newBookmarks = bookMarks.filter(element => element != id)
    setBookmarks(newBookmarks)
}


//render books
async function booksApi (){
    response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=javascript&startIndex=${(currentPage-1)*10}`)
    response = await response.json()
    books = response.items
    return books
}
booksApi().then(()=>{
    renderBooks(booksCard)
})

async function renderBooks(node){
    node.innerHTML = null
    let booklistFragment = document.createDocumentFragment()

    books.forEach(element => {
        let booksItemClone = document.importNode(booksTemplate, true)

        if(element.volumeInfo.imageLinks){
            let bookImg = booksItemClone.querySelector('.card__item__img')
            bookImg.src = element.volumeInfo.imageLinks.thumbnail
        }

        if(element.volumeInfo.title){
            let bookName = booksItemClone.querySelector('.card__item__book')
            bookName.textContent = element.volumeInfo.title
        }

        let bookAuthor = booksItemClone.querySelector('.card__item__author')
        bookAuthor.textContent = element.volumeInfo.authors

        let bookPuplishedYear = booksItemClone.querySelector('.card__item__year')
        bookPuplishedYear.textContent = element.volumeInfo.publishedDate

        let bookBookMark = booksItemClone.querySelector('.bookmark-btn')
        bookBookMark.dataset.bookId = element.id

        let bookMore = booksItemClone.querySelector('.more-btn')
        bookMore.dataset.bookId = element.id

        booksCard.addEventListener('click', (event) => {
            let clickEl = event.target
            if(clickEl.matches('.bookmark-btn')){
                const bookId = clickEl.dataset.bookId
                console.log(clickEl.dataset.bookId);
                addBookmark(bookId)
                renderBookMarklist(bookmarkList)
            }else if(clickEl.matches('.more-btn')){
                const bookId = clickEl.dataset.bookId
                console.log(clickEl.dataset.bookId);
        
                addBookmark(bookId)
                let modalFragment = document.createDocumentFragment()
                
                modalBox.innerHTML = null
                let modalItemClone = getModal()
                let element = books.find(book => book.id == bookId)

                let modalImg = modalItemClone.querySelector('.modal-body-img')
                if(element.volumeInfo.imageLinks){
                    modalImg.src = element.volumeInfo.imageLinks.thumbnail
                }
        
                let modalTitle = modalItemClone.querySelector('.modal-title')
                modalTitle.textContent = element.volumeInfo.title
        
                let modalAuthor = modalItemClone.querySelector('#author')
                modalAuthor.textContent = element.volumeInfo.authors

                let modalAuthor2 = modalItemClone.querySelector('#author2')
                modalAuthor2.textContent = element.volumeInfo.authors
        
                let modalPuplishedYear = modalItemClone.querySelector('#published')
                modalPuplishedYear.textContent = element.volumeInfo.publishedDate

                let modalCotegories = modalItemClone.querySelector('#categories')
                modalCotegories.textContent = element.volumeInfo.categories

                let modalCount = modalItemClone.querySelector('#pageCount')
                modalCount.textContent = element.volumeInfo.pageCount

                modalFragment.appendChild(modalItemClone)
                modalBox.appendChild(modalFragment)
            }
        })

        booklistFragment.appendChild(booksItemClone)

        searchInputEl.addEventListener('key-up', (evt)=> {
            evt.preventDefault()
            const titlefind = inputElement.value
              let foundedBooks = books.filter(book => book.volumeInfo.title.includes(titlefind))
              renderBooks(foundedBooks)
        })
    });
    node.appendChild(booklistFragment)
    showResult.textContent = response.totalItems
    renderPage()
}

//modal
function getModal() {
    let modalInstance = document.getElementById('modal-template').content

    let modalEl = document.importNode(modalInstance, true)

    return modalEl
}

//render bookmark
let bookmarkList = document.querySelector('.bookmark')
let bookmarkItemTemplate = document.getElementById('book-mark').content

function renderBookMarklist(){
    const bookMarks = getBookmarks()
    const booksAll = getBooksById(bookMarks)

    let bookListFragment = document.createDocumentFragment()
    bookmarkList.innerHTML = null

    books.forEach(element => {
        let bookMarkClone = document.importNode(bookmarkItemTemplate, true)

        let bookName = bookMarkClone.querySelector('.bookmark__list__book')
        bookName.textContent = element.volumeInfo.title

        let bookAuthor = bookMarkClone.querySelector('.bookmark__list__author')
        bookAuthor.textContent = element.volumeInfo.authors

        let bookDelete = bookMarkClone.querySelector('.bookmark__list__delete')
        bookDelete.dataset.bookId = element.id


        bookListFragment.appendChild(bookMarkClone)
        bookmarkList.append(bookListFragment)
    });
}

bookmarkList.addEventListener('click', event => {
    if(event.target.matches('.bookmark__list__delete')){
        deleteBookMarks(event.target.dataset.bookId)
        renderBookMarklist(books)
    }
})

