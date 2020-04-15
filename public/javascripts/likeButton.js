const buttons = document.querySelectorAll('span.fivestars')
const submitLike = (postId, value) => {
  alert('testing')
}
buttons.forEach(button => button.addEventListener('click', () => { submitLike(1,1) }))