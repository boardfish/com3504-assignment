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

// Gets stories from the cache
// TODO: try to post them.
const getStoriesFromCache = () => {
  return initDatabase()
    .then(async (db) => {
      var tx = db.transaction("stories", "readonly");
      var store = tx.objectStore("stories");
      var stories = await store.getAll();
      return stories;
    })
    .catch((err) => console.log(err));
};

const loadStories = () => {
  $.ajax({
    // Base on current pathname, so /users/:id/stories only gets user stories
    url: window.location.pathname,
    success: (stories) => {
      renderStories(stories);
    },
    error: () => {
      // Handled by cacheThenNetwork
    },
    contentType: "application/json",
    dataType: "json",
  });
};

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
  var networkDataReceived = false;

  // fetch fresh data
  var networkUpdate = fetch(window.location.pathname, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.json())
    .then((data) => {
      networkDataReceived = true;
      renderStories(data);
    });

  // fetch cached data
  caches
    .match(window.location.pathname)
    .then((response) => {
      if (!response) throw Error("No data");
      return response.json();
    })
    .then((data) => {
      // don't overwrite newer network data
      if (!networkDataReceived) {
        renderStories(data);
      }
    })
    .catch(function (e) {
      // we didn't get cached data, the network is our last hope:
      return networkUpdate;
    })
    .catch(showErrorMessage);
});