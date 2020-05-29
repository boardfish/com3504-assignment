registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/serviceWorker.js");
  } else {
    console.log("Your browser cannot register a service worker.");
  }
};

initDatabase = () => {
  if (!("indexedDB" in window)) {
    console.log("This browser doesn't support IndexedDB");
    return;
  }

  var dbPromise = idb.openDb("test-db1", 1, (upgradeDb) => {
    console.log("Making a new object store...");
    if (!upgradeDb.objectStoreNames.contains("stories")) {
      upgradeDb.createObjectStore("stories", { autoIncrement: true });
    }
  });

  return dbPromise;
};

/**
 * This function retrieves stories that were cached to IndexedDB. These stories
 * came from previous failed attempts to post to the site. Rather than sending
 * all stories, a cursor is returned.
 * @returns {IDBCursorWithValue} A cursor for iterating on in another method.
 */
const getStoriesFromCache = () => {
  return initDatabase()
    .then(async (db) => {
      var tx = db.transaction("stories", "readwrite");
      var store = tx.objectStore("stories");
      return store.openCursor();
    })
    .catch((err) => console.log(err));
};


/**
 * This function sends a request to the JSON endpoint for the current page
 * by setting the Content-Type header to application/json. This means that if
 * the user is at /, they'll receive all stories, and if they're at a user's
 * wall (/users/:userId/stories), they'll receive that user's stories.
 * ?json is added to the path so that it is cached separately to the HTML
 * request - the cache matches on pathnames too, but fortunately this solution
 * helps there!
 * If the request is successful, the stories are rendered. Otherwise, nothing
 * happens under the assumption that it'll be handled elsewhere.
 */
const loadStories = () => {
  var networkDataReceived = false;

  // fetch fresh data
  var networkUpdate = fetch(window.location.pathname  + '?json', {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (!networkDataReceived) {
        networkDataReceived = true;
        getStoriesFromCache().then(function postDrafts(cursor) {
          console.log(data)
          if (!cursor) { return data }
          return submitStory(cursor.value, 
            () => { return data },
            cursor.delete().then(() => {
              return cursor.continue().then(postDrafts)
            })
          )
        }).then((data) => renderStories(data))
      }
    });

  // fetch cached data
  caches
    .match(window.location.pathname + '?json')
    .then((response) => {
      if (!response) throw Error("No data");
      return response.json();
    })
    .then((data) => {
      // don't overwrite newer network data
      setTimeout(() => { if (!networkDataReceived) {
        renderStories(data);
      }}, 300)
    })
    .catch(function (e) {
      // we didn't get cached data, the network is our last hope:
      return networkUpdate;
    })
    .catch(showErrorMessage);
};


/**
 * This function renders a JSON array of stories by appending them to the main
 * element of the page. It fetches the HTML from the /stories/:storyId endpoint.
 * @param {[object]} stories an array of stories
 */
const renderStories = (stories) => {
  stories.forEach((story) => {
    // Render if they aren't already rendered.
    if ($(`#story-${story._id}`).length === 0) {
      $.get(`/stories/${story._id}`, {}, (html) => {
        $("main.container").append(html);
      });
    }
  });
};

/**
 * This function displays an error message and a prompt to refresh the page in
 * case of any issues along the way.
 */
const showErrorMessage = () => {
  $("main.container")
    .addClass("d-flex flex-grow-1 align-items-center justify-content-center")
    .html(
      [
        '<div class="alert alert-danger text-center">',
        '  <p class="mb-0">',
        "     We could not retrieve posts. Please ensure that you have a working",
        "     internet connection.",
        "  </p>",
        '  <button class="btn btn-info mt-2" onclick="location.reload();">Refresh Page</button>',
        '</div>',
      ].join("\n")
    );
};

$(document).ready(() => {
  registerServiceWorker();
  loadStories()
});