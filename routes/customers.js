var express = require("express")  

var customersController = require("../controllers/customers") 
var reportsRoutes = require("../controllers/reports")
var userController = require("../controllers/user")

var multipart = require("connect-multiparty")  



const api = express.Router()



api.post("/customers/write-massive", multipart(), customersController.writeMassive)

api.post("/customers/validate-before-write", multipart(), customersController.validate)

api.post("/customers/update-customers", multipart(), customersController.updateCustomers)

api.post("/garages/write-massive", multipart(), customersController.writeMassiveGarages)

api.get("/customers/fill-data-clients",  customersController.fillDataClients)



api.get("/customers/test", function(req,res){  
  res.send('APi OK ok')
})



api.post("/customers/telesign", customersController.telesign)
api.get("/customers/postventas", customersController.postVenta)


//Reports
api.post("/reports/get-object-by-rtm-location", reportsRoutes.getObjectByRTMLocation)
api.post("/reports/get-rtm-perdidas", reportsRoutes.getRTMPerdidas)


//Users
api.post("/user/create", userController.createUser)
api.delete("/user/delete/:uid", userController.deleteUser)



module.exports = api

