var navbar = require("../views/data/navbar.json")

exports.render = (req, res, viewName, err, jsonData, htmlData) => {
  switch (req.header('Content-Type')) {
    case 'application/json':
      return renderJson(res, err, jsonData)
    default:
      return renderHtml(req, res, viewName, err, htmlData)
  }
};

const renderHtml = (req, res, viewName, err, data) => {
  if (err) {
    res.status(500).render("error", {
      error: { status: 500, stack: "" },
      message: JSON.stringify(err),
    });
    return;
  }
  res.render(viewName, {
    title: "Express",
    path: req.path,
    navbar: navbar,
    ...data,
  });
};

const renderJson = (res, err, data) => {
  if (err) {
    res.status(500).send(JSON.stringify({ error: err }));
    return;
  }
  res.send(data);
};
