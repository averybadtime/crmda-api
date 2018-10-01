var express = require("express")
var reportsRoutes = require("../controllers/reports")

const api = express.Router()

api.get("/reports/get-object-by-rtm-location", reportsRoutes.getObjectByRTMLocation)
api.get("/reports/get-object-by-location", reportsRoutes.getObjectByLocation)
api.get("/reports/get-rtm-perdidas", reportsRoutes.getRTMPerdidas)

module.exports = api