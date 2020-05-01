var navbar = require("../views/data/navbar.json")

exports.render = (req, res, viewName, status, err, jsonData, htmlData) => {
  if (err) {
    renderError(req, res, status === 200 ? 500 : status, err)
    return
  }
  switch (req.header("Content-Type")) {
    case "application/json":
      return renderJson(res, err, jsonData)
    default:
      return renderHtml(req, res, viewName, err, htmlData)
  }
}

const renderError = (req, res, status, err) => {
  if (!(typeof err === "string" || err instanceof String)) {
    err = JSON.stringify(err)
  }
  switch (req.header("Content-Type")) {
    case "application/json":
      res.status(status || 500).send(JSON.stringify({ error: err }))
      return
    default:
      res.status(status || 500).render("friendly-error", {
        error: err,
        status: status,
        title: "Oops!",
        path: req.path,
        navbar: navbar,
      })
      return
  }
}

const renderHtml = (req, res, viewName, err, data) => {
  res.render(viewName, {
    title: "Express",
    path: req.path,
    navbar: navbar,
    ...data,
  })
}

const renderJson = (res, err, data) => {
  res.send(data)
}
