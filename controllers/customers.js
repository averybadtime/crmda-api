var admin = require("../firebase")
var moment = require("moment")
var papaparse = require("papaparse")
var fs = require("fs")
var groupArray = require('group-array')
var Validator = require("fastest-validator")





async function writeMassive(req, res) {
  try {
      const customersRef = admin.database().ref("/customers")
      const importCustomerRef = admin.database().ref("/importCustomersLog")
      const c = await fs.readFileSync(req.files.csvFile.path, "utf8")
      var importCustomerKey = importCustomerRef.push().key
      let now = moment().unix()
      const d = papaparse.parse(c, {
          complete: result => {
              let selectedLocation = req.body.selectedLocation
              const sourceKey = req.body.sourceKey
              let uid = req.body.uid
              var countUpdated = 0;
              var countNews = 0;
              var countCustomers = 0;
              countCustomers = result.data.length;
              var i = 0
              result.data.forEach(async (x) => {
                  if (x[0]) {
                      let fechaRtmBD
                      let fechaRtmBDUnix
                      let fechaRtmVencida
                      let fechaRtmVencidaUnix
                      if (x[0] != '') {
                          fechaRtmBD = moment(x[0], 'D/MM/YYYY')
                          fechaRtmBDUnix = moment(x[0], 'D/MM/YYYY').unix()
                          fechaRtmVencida = moment(x[0], 'D/MM/YYYY').add(1, 'Y')
                          fechaRtmVencidaUnix = fechaRtmVencida.unix()
                      } else {
                          fechaRtmVencidaUnix = ''
                      }
                      var telefonos = []
                      var statusCode = 're_venta'
                      var rtm = 'customer_bd'
                      admin.database().ref("/customers").child(x[2]).once('value', customerSnapshot => {
                          const Customer = customerSnapshot.val()
                          countNews++
                          if (x[6]) {
                              if (x[6].length == 10) {
                                  telefonos.push(x[6])
                              }
                          }
                          if (x[12]) {
                              if (x[12].length == 7 && x[12] != 100000) {
                                  telefonos.push(x[12])
                              }
                          }
                      }).then(() => {
                          const Customer = {
                              fechaRtm: x[0] || null,
                              fechaRtmBD: fechaRtmBD.format('DD/MM/YYYY') || null,
                              fechaRtmBDUnix: fechaRtmBDUnix || null,
                              nombreCliente: x[1] || null,
                              registro1: x[3] || null,
                              identificacion: x[4] || null,
                              direccion: x[5] || null,
                              telefonos: telefonos,
                              marca: x[7] || null,
                              linea: x[8] || null,
                              tipoServicio: x[9] || null,
                              tipoVehiculo: x[10] || null,
                              modelo: x[11] || null,
                              fechaRtmVencida: fechaRtmVencida.format('DD/MM/YYYY') || null,
                              fechaRtmVencidaUnix: fechaRtmVencidaUnix || null,
                              poseedor: x[13] || null,
                              celular2: x[14] || null,
                              createdAt: now,
                              sourceKey: sourceKey,
                              location: selectedLocation,
                              createdBy: uid,
                              rtm: rtm,
                              statusCode: statusCode
                          }
                          console.log(Customer)
                          admin.database().ref("/customers/" + x[2]).update(Customer)
                      })
                  }
              })
              setTimeout(() => {
                  const importCustomers = {
                      location: selectedLocation,
                      countNews: countNews,
                      uid: uid,
                      createdAt: now
                  }
                  admin.database().ref("/checksCustomer/" + importCustomerKey).update(importCustomers)
                  const response = {
                      success: !0,
                      countNews,
                      importCustomers
                  }
                  return res.status(200).json(response)
              }, 5000)
          }
      })
  } catch (ex) {
      console.log(ex);
      return res.status(500).json({
          error: ex
      })
  }
}
async function validate(req, res) {
  try {
      const c = await fs.readFileSync(req.files.csvFile.path, "utf8")
      const d = papaparse.parse(c, {
          complete: result => {
              let a = 0,
                  b = 0,
                  c = 0,
                  d = 0,
                  e = 0,
                  f = 0,
                  g = 0,
                  h = 0,
                  i = 0,
                  j = 0,
                  k = 0,
                  l = 0,
                  m = 0,
                  n = 0,
                  o = 0
              result.data.forEach(row => {
                  if (row[0] && row[0].trim() !== "") {
                      a++
                  }
                  if (row[1] && row[1].trim() !== "") {
                      b++
                  }
                  if (row[2] && row[2].trim() !== "") {
                      c++
                  }
                  if (row[3] && row[3].trim() !== "") {
                      d++
                  }
                  if (row[4] && row[4].trim() !== "" && row[4] != "1000000") {
                      e++
                  }
                  if (row[5] && row[5].trim() !== "") {
                      f++
                  }
                  if (row[6] && row[6].trim() !== "" && row[6] != "1000000") {
                      g++
                  }
                  if (row[7] && row[7].trim() !== "") {
                      h++
                  }
                  if (row[8] && row[8].trim() !== "") {
                      i++
                  }
                  if (row[9] && row[9].trim() !== "") {
                      j++
                  }
                  if (row[10] && row[10].trim() !== "") {
                      k++
                  }
                  if (row[11] && row[11].trim() !== "") {
                      l++
                  }
                  if (row[12] && row[12].trim() !== "" && row[12] != "1000000") {
                      m++
                  }
                  if (row[13] && row[13].trim() !== "") {
                      n++
                  }
                  if (row[14] && row[14].trim() !== "" && row[14] != "1000000") {
                      o++
                  }
              })
              res.status(200).json({
                  fields: {
                      a,
                      b,
                      c,
                      d,
                      e,
                      f,
                      g,
                      h,
                      i,
                      j,
                      k,
                      l,
                      m,
                      n,
                      o
                  },
                  csvLength: result.data.length
              })
          }
      })
  } catch (ex) {
      console.log(ex);
      return res.status(500).json({
          error: ex
      })
  }
}
async function updateCustomers(req, res) {
  try {
      const checkCustomersRef = admin.database().ref("/checksCustomers")
      const c = await fs.readFileSync(req.files.csvFile.path, "utf8")
      const d = papaparse.parse(c, {
          complete: result => {
              const selectedLocation = req.body.selectedLocation
              const uid = req.body.uid
              const locationRef = admin.database().ref("/locations/" + selectedLocation)
              var countUpdated = 0;
              var countNews = 0;
              var countCustomers = 0;
              var countPostVenta = 0;
              var countArray = 1;
              var countFail = 0;
              var failCertificado = 0;
              var failNombre = 0;
              var sourceKey
              var errorValidator = {}
              countCustomers = result.data.length;
              var checkCustomerKey = checkCustomersRef.push().key
              const selectedFields = JSON.parse(req.body.selectedFields)
              result.data.forEach(async (x) => {
                  if (x[0]) {
                      if (x[1] == '') failNombre++
                      if (x[3] == '') failCertificado++
                      if (x[2] != '') {
                          let fechaRtm
                          let fechaRtmUnix
                          var fechaRtmVencida
                          var fechaRtmVencidaUnix
                          var jsDate
                          var jsDateUnix
                          var jsDateVencimiento
                          var jsDateVencimientoUnix
                          if (x[0] != '') {
                              jsDate = moment(x[0], 'DD/MM/YYYY')
                              jsDateUnix = jsDate.unix()
                              jsDateVencimiento = moment(x[0], 'DD/MM/YYYY').add(1, 'y')
                              jsDateVencimientoUnix = jsDateVencimiento.unix()
                          }
                          var now
                          var telefonos = []
                          var statusCode = 'venta'
                          var typeRtm = ''
                          var fechaRtmBD
                          var Customer
                          admin.database().ref("/customers").child(x[2]).once('value', customerSnapshot => {
                              now = moment().unix()
                              Customer = customerSnapshot.val()
                              if (customerSnapshot.exists()) {
                                  now = Customer.createdAt
                                  sourceKey = Customer.sourceKey
                                  typeRtm = 'customer_exist'
                                  statusCode = 'post_venta'
                                  countUpdated++
                                  if (Customer.telefonos) {
                                      telefonos = Customer.telefonos
                                      if (x[6]) {
                                          if (x[6].length == 10) {
                                              if (telefonos.indexOf(x[6]) === -1) {
                                                  telefonos.push(x[6])
                                              }
                                          }
                                      }
                                      if (x[12]) {
                                          if (x[12].length == 10) {
                                              if (telefonos.indexOf(x[12]) === -1) {
                                                  telefonos.push(x[12])
                                              }
                                          }
                                      }
                                  } else {
                                      telefonos.push(x[6])
                                  }
                              } else {
                                  typeRtm = 'customer_new'
                                  countNews++
                                  statusCode = 'post_venta'
                                  sourceKey = '-LLd8SAVBdA3lADfzw3s'
                                  if (x[6]) {
                                      if (x[6].length == 10) {
                                          telefonos.push(x[6])
                                      }
                                  }
                                  if (x[12]) {
                                      if (x[12].length == 7 && x[12] != 1000000) {
                                          telefonos.push(x[12])
                                      }
                                  }
                              }
                          }).then(() => {
                              let nCustomer = {}
                              if (selectedFields.a) {
                                  nCustomer.fechaRtm2018 = jsDate.format('DD/MM/YYYY') || null
                                  nCustomer.fechaRtm2018Unix = jsDateUnix || null
                                  nCustomer.fechaRtmVencida = jsDateVencimiento.format('DD/MM/YYYY') || null
                                  nCustomer.fechaRtmVencidaUnix = jsDateVencimientoUnix || null
                              }
                              if (selectedFields.b) nCustomer.nombreCliente = x[1] || null
                              if (selectedFields.d) nCustomer.registro1 = x[3] || null
                              if (selectedFields.e) nCustomer.identificacion = x[4] || null
                              if (selectedFields.f) nCustomer.direccion = x[5] || null
                              if (selectedFields.g) nCustomer.telefonos = telefonos || null
                              if (selectedFields.h) nCustomer.marca = x[7] || null
                              if (selectedFields.i) nCustomer.linea = x[8] || null
                              if (selectedFields.j) nCustomer.tipoServicio = x[9] || null
                              if (selectedFields.k) nCustomer.tipoVehiculo = x[10] || null
                              if (selectedFields.l) nCustomer.modelo = x[11] || Customer.modelo || null
                              if (selectedFields.n) nCustomer.poseedor = x[13] || null
                              if (selectedFields.o) nCustomer.celular2 = x[14] || null
                              nCustomer.location = selectedLocation
                              nCustomer.createdBy = uid
                              nCustomer.rtm = typeRtm
                              nCustomer.statusCode = statusCode
                              nCustomer.checkCustomerKey = checkCustomerKey
                              console.log(nCustomer);
                              admin.database().ref("/customers/" + x[2]).update(nCustomer)
                          }).catch(err => res.status(500).json({
                              error: err
                          }))
                      } else {
                          countFail++
                      }
                      countArray++
                  }
              })
              setTimeout(() => {
                  const response = {
                      success: !0,
                      locationName: selectedLocation,
                      countNews,
                      countUpdated,
                      countArray,
                      countFail,
                      errorValidator,
                      failNombre,
                      failCertificado
                  }
                  const checkCustomer = {
                      uid: uid,
                      createdAt: moment().unix(),
                      customersUpdated: countUpdated,
                      customersNew: countNews,
                      location: selectedLocation,
                      failCertificado: failCertificado,
                      failNombre: failNombre,
                      countFail: countFail
                  }
                  checkCustomersRef.child(checkCustomerKey).set(checkCustomer)
                  return res.status(200).json(response)
              }, 4000)
          }
      })
  } catch (ex) {
      console.error(ex)
      return res.status(500).json({
          error: ex
      })
  }
}






async function fillDataClients(req, res) {

  try {

    const customerRef = admin.database().ref("/customers")


    const uid = req.body.uid



    const response = {

      success:true,

      totalRecords: 1,

      rows: {}

    }



    customerRef.once('value', (customerSnap)=>{

      let i = 0      

      customerSnap.forEach((snap)=>{

        const data = snap.val()

        

          if(data.rtm){

            

          }else{

            



            const uCustomer = {

              rtm: 'customer_bd'

            }

            //admin.database().ref('/customers/'+snap.key).update(uCustomer)

            console.log(snap.key, uCustomer, data.rtm);

            

          }

            

       



        i++

      })



      

      



     // return res.status(200).json(clientsSnap.val())

    })





     return res.status(200).json(response)

      

    

  } catch(ex) {

    

      

    

    return res.status(500).json({ error: ex })

  }
}

async function postVenta(req,res){
  admin.database().ref("/customers").orderByChild('statusCode').equalTo('post_venta').once('value',logCheckSnapshot=>{

    logCheckSnapshot.forEach((snap)=>{

      const Customer = snap.val()

      



      // const fechaRtm = moment(Customer.fechaRtmBD,'D/MM/YYYY')





      // const data = {

      //   fechaRtm: fechaRtm.add(1,'y').format('D/MM/YYYY')

      // }



      // console.log(Customer.fechaRtmBD, data.fechaRtm);



      console.log(Customer.fechaRtm, Customer.fechaRtmBD,Customer.fechaRtmBDUnix );

      

      

    })

  })

  res.send('Post Ventas Log')
}

function telesign(req, res) {

  var TeleSignSDK = require('telesignsdk')



  const customerId = "FB791AA5-D8E7-43A4-85B2-99293530562D";

  const apiKey = "gm5egS8DoztVUfXC0bn7mxMUHUteLLeTVcOIIQbITO7pVqPcvzHqlmv/dKCQdj8Pn1a77+NCct1nAY/qpYU21Q==";

  const rest_endpoint = "https://rest-api.telesign.com";

  const timeout = 10*1000; // 10 secs



  const client = new TeleSignSDK( customerId,

      apiKey,

      rest_endpoint,

      timeout // optional

      // userAgent

  );



  const phoneNumber = req.body.to;

  const message = req.body.sms;

  const messageType = "ARN";



  console.log("## MessagingClient.message ##");



  function messageCallback(error, responseBody) {

    if (error === null) {

      const response = {

        success:true,

        code: responseBody['status']['code'],

        description: responseBody['status']['description'],

        phoneNumber: phoneNumber

      }

      return res.status(200).json(response)

    } else {

      return res.status(500).json({ error: error })

    }

  }

  client.sms.message(messageCallback, phoneNumber, message, messageType);
}

function getInactivos(req, res) {
  let start = req.query.start
  let end = req.query.end

  //console.log(moment().unix(start).format('DD/MM/YYYY'));
  
  console.log(start, end);
  

  admin.database().ref("/customers")
    .orderByChild("fechaRtmVencidaUnix")
    .startAt(start)
    .endAt(end)
    .once("value")
    .then(snapshot => {
      let data = []
      snapshot.forEach(child => {
        data.push({ key: child.key, value: child.val() })

        console.log(child.val());
        
      })
      res.status(200).send({ customers: JSON.stringify(data) })
    })
    .catch(err => {
      console.error(err)
    })
}

module.exports = { writeMassive, validate, updateCustomers, fillDataClients, postVenta, telesign, getInactivos }