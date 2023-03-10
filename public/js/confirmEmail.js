const allEmails = allStudents.map((e) => {
  return e.email
})

const allUsernames = allStudents.map((e) => {
  return e.username
})

const register = document.querySelector('#registerBtn')

const username = document.querySelector('#userName')
const email = document.querySelector('#email')

username.addEventListener('change', validUsername)
email.addEventListener('change', validEmail)

function validUsername(e) {
  validateField(username, allUsernames)
}

function validEmail(e) {
  validateField(email, allEmails)
  const checkRegEx = validateEmailRegEx(email.value)
  register.disabled = !checkRegEx
  if (checkRegEx) {
    email.classList.remove('is-invalid')
    email.classList.add('is-valid')
  } else {
    email.classList.add('is-invalid')
    email.classList.remove('is-valid')
  }
}

function validateEmailRegEx(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

function validateField(field, validateArr) {
  const val = field.value
  const isUnique = validateArr.every((e) => {
    return e !== val
  })
  register.disabled = !isUnique
  if (isUnique) {
    field.classList.remove('is-invalid')
    field.classList.add('is-valid')
  } else {
    field.classList.add('is-invalid')
    field.classList.remove('is-valid')
  }
}
