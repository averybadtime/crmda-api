var app = require("./app")
const formData = require("express-form-data")
const os = require("os")
var bodyParser = require("body-parser")
var cors = require("cors")
var customersRoutes = require("./routes/customers")
var userRoutes = require("./routes/user")
var reportsRoutes = require("./routes/reports")
var https = require("https")

const PORT = 3000
const options = {
	uploadDir: os.tmpdir(),
	autoClean: true
}

app.use(formData.parse(options))
app.use(formData.format())
app.use(formData.stream())
app.use(formData.union())

app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))

app.use("/api", customersRoutes)
app.use("/api", userRoutes)
app.use("/api", reportsRoutes)

app.listen(PORT, () => console.log("Server running on port: ", PORT))