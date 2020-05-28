/**
 * Wrapper functions to make it easier to render HTML and JSON in the right
 * circumstances with the right data across the app.
 * @module Utils
 */

var navbar = require("../views/data/navbar.json")

/**
 * Wrapper function for rendering pages. If it's passed an error, it'll render
 * it appropriately by delegating to renderError. Otherwise, it'll render JSON
 * if Content-Type is set to application/json, or it'll render HTML.
 * @param {Request} req a Request object
 * @param {Response} res a Response object
 * @param {string} viewName the name of the view for the templating engine to render
 * @param {number} status a status code to return in the event of an (expected) error
 * @param {error} err an error
 * @param {Object} jsonData the data to return if JSON was asked for
 * @param {Object} htmlData data to pass to the templating engine in rendering HTML
 * @param {string} titleAppend a string to append to the page title
 * @memberof Utils
 */
exports.render = (
  req,
  res,
  viewName,
  status,
  err,
  jsonData,
  htmlData,
  titleAppend
) => {
  if (err) {
    renderError(req, res, status === 200 ? 500 : status, err)
  } else {
    switch (req.header("Content-Type")) {
      case "application/json":
        renderJson(res, err, jsonData)
        break
      default:
        renderHtml(req, res, viewName, err, htmlData, titleAppend)
    }
  }
}

/**
 * Renderer for errors. Errors are displayed in a similar style to the rest of
 * the app.
 * @param {Request} req a Request object
 * @param {Response} res a Response object
 * @param {number} status a status code to return in the event of an (expected) error
 * @param {error} err an error
 * @memberof Utils
 */
const renderError = (req, res, status, err) => {
  if (!(typeof err === "string" || err instanceof String)) {
    err = JSON.stringify(err)
  }
  switch (req.header("Content-Type")) {
    case "application/json":
      res.send({ error: err })
      break
    default:
      res.render("friendly-error", {
        error: err,
        status: status || 500,
        title: "Oops!",
        path: req.path,
        navbar: navbar,
        user: req.user,
      })
      return
  }
}

/**
 * This function wraps Express' res.render function, ensuring that it always
 * supplies several variables to the templating engine that are necessary for
 * every page.
 * @param {Request} req a Request object
 * @param {Response} res a Response object
 * @param {string} viewName the name of the view for the templating engine to render
 * @param {error} err an error
 * @param {Object} data data to pass to the templating engine
 * @param {string} titleAppend an optional string to append to the page title
 * @memberof Utils
 */
const renderHtml = (req, res, viewName, err, data, titleAppend) => {
  res.render(viewName, {
    title: `Nodethings${
      typeof titleAppend === "undefined" ? "" : ` - ${titleAppend}`
    }`,
    path: req.path,
    navbar: navbar,
    ...data,
  })
}

/**
 * This function simply wraps Express' res.send function, but it's named as such
 * to make this file's render function more readable.
 * @param {Response} res a Response object
 * @param {error} err an error
 * @param {Object} data data to render to a JSON response
 * @memberof Utils
 */
const renderJson = (res, err, data) => {
  res.send(data)
}
