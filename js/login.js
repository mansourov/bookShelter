var emailInputEl = document.querySelector('.form__email__input')
var passwordInputEl = document.querySelector('.form__password__input')
var notificationEl = document.querySelector('.notifications')
var loginFormEl = document.querySelector('.login__form')
var alertTemplate = document.querySelector('#alertTemplate').content
const API = 'https://reqres.in/api'

// 
async function login(credentials){
    return new Promise((resolve, reject) => {
        fetch(`${API}/login`, {
            method:'POST',
            headers:{
                "Content-type":'application/json'
            },
            body:JSON.stringify(credentials)
        })
        .then(res =>{
            if(res.status === 400)reject(res)
            return res.json()
        })
        .then(res => {
            if(res.token){
                window.localStorage.setItem('token',res.token)
                window.location.replace('index.html')
            }
            const response = JSON.parse(JSON.stringify(res))
            alert(response.error)
        })
        .catch(err => {
            alert(err)
        })
    
    }) 
}


loginFormEl.addEventListener('submit', event => {
    event.preventDefault()
    const body = {
        email:emailInputEl.value,
        password:passwordInputEl.value
    }
    try {
        login(body)
    } catch (error) {
        alert(error)
    }
})



