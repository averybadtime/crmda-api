var app = require("./app")
var bodyParser = require("body-parser")
var cors = require("cors")
var customersRoutes = require("./routes/customers")
var userRoutes = require("./routes/user")
var reportsRoutes = require("./routes/reports")
var https = require("https")

const PORT = 3000

app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))

app.use("/api", customersRoutes)
app.use("/api", userRoutes)
app.use("/api", reportsRoutes)

app.listen(PORT, () => console.log("Server running on port: ", PORT))