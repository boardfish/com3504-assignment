var navbar = require("../views/data/navbar.json")

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
      })
      return
  }
}

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

const renderJson = (res, err, data) => {
  res.send(data)
}
