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
const newStoryForm = $("form#newStory");

const submitStory = (data) => {
  sendAjaxQuery(
    `/stories`,
    data,
    () => {
      alert("We couldn't submit your story. Please try again.");
    },
    (data) => {
      newStoryForm.slideUp(400, () =>
        newStoryForm.trigger("reset").slideDown()
      );
    }
  );
};

$(document).ready(function () {
  console.log('ret-2-go!')
  initDatabase()
    .then(async (db) => {
      var tx = db.transaction("stories", "readwrite");
      var store = tx.objectStore("stories");
      var data = { user: "bar", id: "baz"}
      console.log('adding the thing')
      await store.add(data);
      return tx.complete;
    })
    .then(() => {
      console.log("i have no console and I must log");
    })
    .catch((err) => console.log(err));
});

const serializeToJson = (jQueryFormObject) => {
  // from https://stackoverflow.com/a/24012884
  return jQueryFormObject.serializeArray().reduce((obj, item) => {
    obj[item.name] = item.value;
    return obj;
  }, {});
};

newStoryForm.submit((e) => {
  e.preventDefault();
  submitStory(JSON.stringify(serializeToJson(newStoryForm)));
});
