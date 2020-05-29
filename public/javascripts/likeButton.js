// from the slides for week 3
const sendAjaxQuery = (url, data, errorCallback, successCallback) => {
  $.ajax({
    url: url,
    type: "POST",
    data: data,
    context: this,
    contentType: "application/json",
    error: errorCallback,
    success: successCallback
  });
};

const submitLike = (storyId, vote) => {
  sendAjaxQuery(
    `/stories/${storyId}/rate/${vote}`,
    {},
    () => {
      alert("Could not submit your vote.");
    },
    () => {
      $(`span.fivestars[data-story-id=${storyId}]`).removeClass(
        Array(5)
          .fill()
          .map((_, i) => `text-${i + 1}-star`)
          .join(" ")
      );
      $(
        `span.fivestars[data-story-id=${storyId}]:nth-child(-n+${vote})`
      ).addClass(`text-${vote}-star`);
      $(`span.fivestars[data-story-id=${storyId}]`).removeClass("selected");
      $(`span.fivestars[data-story-id=${storyId}]:nth-child(${vote})`).addClass(
        "selected"
      );
    }
  );
};

$(document).on("click", "span.fivestars", (e) => {
  submitLike(e.target.dataset.storyId, e.target.dataset.value);
});
