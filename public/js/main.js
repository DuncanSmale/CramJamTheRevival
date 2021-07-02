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
})()
