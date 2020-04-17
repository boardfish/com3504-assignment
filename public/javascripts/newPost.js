// from the slides for week 3
// const sendAjaxQuery = (url, data, errorCallback, successCallback) => {
//   $.ajax({
//     url: url,
//     type: "POST",
//     data: data,
//     context: this,
//     contentType: "application/json",
//     error: errorCallback,
//     success: successCallback,
//   });
// };

// We need jQuery smarts for seralizeArray
const newPostForm = $("form#newPost");

const submitStory = (data) => {
  sendAjaxQuery(
    `http://localhost:4000/stories`,
    data,
    () => {
      alert("We couldn't submit your post. Please try again.");
    },
    () => {
      newPostForm.slideUp(400, () => newPostForm.trigger("reset").slideDown())
    }
  );
};

const serializeToJson = (jQueryFormObject) => {
  // from https://stackoverflow.com/a/24012884
  return jQueryFormObject.serializeArray().reduce((obj, item) => {
    obj[item.name] = item.value;
    return obj;
  }, {});
}

  newPostForm.submit((e) => {
    e.preventDefault();
    submitStory(JSON.stringify(serializeToJson(newPostForm)));
  })
