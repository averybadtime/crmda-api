var express = require("express")
var reportsRoutes = require("../controllers/reports")

const api = express.Router()

api.post("/reports/get-object-by-rtm-location", reportsRoutes.getObjectByRTMLocation)
api.post("/reports/get-object-by-location", reportsRoutes.getObjectByLocation)
api.post("/reports/get-rtm-perdidas", reportsRoutes.getRTMPerdidas)

module.exports = api