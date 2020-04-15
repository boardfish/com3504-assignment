// from the slides for week 3
const sendAjaxQuery = (url, data) => {
  $.ajax({
    url: url,
    type: "POST",
    data: data,
    context: this,
    contentType: 'application/json',
    error: () => { alert('Failure') },
    success: () => { alert('Success') },
  })
}

const buttons = document.querySelectorAll("span.fivestars");

const submitLike = (storyId, vote) => {
  sendAjaxQuery(`http://localhost:4000/stories/${storyId}/rate/${vote}`, {})
};

buttons.forEach((button) =>
  button.addEventListener("click", () => {
    submitLike(button.dataset.postId, button.dataset.value);
  })
);
