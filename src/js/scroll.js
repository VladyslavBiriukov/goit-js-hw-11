export { onScroll, onTopBtn }

const toTopBtn = document.querySelector('.btn-to-top')

window.addEventListener('scroll', onScroll)
toTopBtn.addEventListener('click', onTopBtn)

function onScroll() {
  const scrolled = window.pageYOffset
  const coords = document.documentElement.clientHeight

  if (scrolled > coords) {
    toTopBtn.classList.add('btn-to-top--visible')
  }
  if (scrolled < coords) {
    toTopBtn.classList.remove('btn-to-top--visible')
  }
}

function onTopBtn() {
  if (window.pageYOffset > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}