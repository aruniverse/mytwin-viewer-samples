const app = require("express")();
app.use(require('cors')())

app.get("/tank-params", (req, res) => {
  res.json({
    level: Math.random(),
    pressure: Math.random(),
  });
});

app.listen(3001, () => console.log("listening on localhost"));
