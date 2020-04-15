const buttons = document.querySelectorAll("span.fivestars");
const submitLike = (postId, value) => {
  alert(postId);
  alert(value);
};
buttons.forEach((button) =>
  button.addEventListener("click", () => {
    submitLike(button.dataset.postId, button.dataset.value);
  })
);
