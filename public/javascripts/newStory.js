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

// Caches a story.
cacheStory = (object) => {
  initDatabase()
    .then(async (db) => {
      var tx = db.transaction("stories", "readwrite");
      var store = tx.objectStore("stories");
      const newValue = await store.add(object);
      console.log("Could not post story. Caching...");
      console.log(object);
      console.log(newValue);
      return tx.complete;
    })
    .catch((err) => console.log(err));
};

// We need jQuery smarts for seralizeArray
const newStoryForm = $("form#newStory");

const submitStory = (data, failureCallback, successCallback) => {
  sendAjaxQuery(`/stories`, data, failureCallback, successCallback);
};

$(document).ready(function () {
  // loadStories();
});


/**
 * This function serializes a form passed in as a jQuery object (e.g.
 * $("#form")) to a JS object of the form { name: value }. 
 * @param {object} jQueryFormObject a form element in a jQuery object
 * @returns {object} the serialized content of the form
 */
const serializeToJson = (jQueryFormObject) => {
  // from https://stackoverflow.com/a/24012884
  return jQueryFormObject.serializeArray().reduce((obj, item) => {
    obj[item.name] = item.value;
    return obj;
  }, {});
};

newStoryForm.submit((e) => {
  e.preventDefault();
  var data = JSON.stringify(serializeToJson(newStoryForm));
  submitStory(
    data,
    () => {
      cacheStory(data);
      alert("Could not submit your post. It's been saved as a draft.");
    },
    (data) => {
      newStoryForm.slideUp(400, () =>
        newStoryForm.trigger("reset").slideDown()
      );
      loadStories();
    }
  );
});
