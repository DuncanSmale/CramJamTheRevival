document.getElementById('modal-button').addEventListener('click', function () {
  document.querySelector('.bg-modal').style.display = 'flex'
})

document.querySelector('.close').addEventListener('click', function () {
  document.querySelector('.bg-modal').style.display = 'none'
})
(function () {
  'use strict'
  const the_rest = document.querySelector('.all')
  const header_navbar = document.querySelector('.navbar-area')

  window.onscroll = function () {
    const sticky = header_navbar.offsetTop

    if (window.pageYOffset > sticky) {
      header_navbar.classList.add('sticky')
      the_rest.style.padding = '136px 0px 0px 0px'
    } else {
      header_navbar.classList.remove('sticky')
      the_rest.style.padding = ''
    }
  }

  if ('geolocation' in navigator) {
    console.log('available')
    navigator.geolocation.watchPosition((position) => {
		  console.log(position.coords.latitude)
		  console.log(position.coords.longitude)
		  console.log(position)
    })
	  } else {
    console.log('not available')
	  }
})()
