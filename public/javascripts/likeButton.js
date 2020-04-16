// from the slides for week 3
const sendAjaxQuery = (url, data, errorCallback, successCallback) => {
  $.ajax({
    url: url,
    type: "POST",
    data: data,
    context: this,
    contentType: "application/json",
    error: errorCallback,
    success: successCallback,
  });
};

const buttons = document.querySelectorAll("span.fivestars");

const submitLike = (storyId, vote) => {
  sendAjaxQuery(
    `http://localhost:4000/stories/${storyId}/rate/${vote}`,
    {},
    () => {
      alert("Error");
    },
    () => {
      $(`span.fivestars[data-post-id=${storyId}]`).css('color', 'black')
      $(`span.fivestars[data-post-id=${storyId}]:nth-child(-n+${vote})`).css('color', 'red')
    }
  );
};

buttons.forEach((button) =>
  button.addEventListener("click", () => {
    submitLike(button.dataset.postId, button.dataset.value);
  })
);
