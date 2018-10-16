var admin = require("../firebase")

var moment = require("moment")

var papaparse = require("papaparse")

var fs = require("fs")

var groupArray = require('group-array')





async function updateGarages(req, res) {

  try {


    var garagesUpdated = 0
    var garagesNew = 0


    const c = await fs.readFileSync(req.files.csvFile.path, "utf8")

    const d = papaparse.parse(c, {

      complete: result => {

        const now = moment().unix()

        const uid = req.body.uid

        var i = 0


        var checksGarageKey = admin.database().ref("/checkGarages").push().key

      

        result.data.forEach(x => {
          

          if(x[1] && Number.parseInt(x[0])){


            let garageKey = x[0] || null
            let customerKey = x[1] || null
         
            const nCustomer = {

                garageKey: garageKey,
                pin: x[2] || null

            }

            var updates = {};

             admin.database().ref("/garages/"+garageKey).once('value').then((snapGarage)=>{

              if(snapGarage.exists()){
                garagesUpdated++
              }else{
                garagesNew++
              }

              const dataGarage = snapGarage.val()

              const CustomersHasMany = dataGarage.CustomersHasMany || 0
              
              updates['/garages/' + garageKey + '/CustomersHasMany'] = CustomersHasMany + 1;

              updates['/garages/' + garageKey + '/customersKey/' + customerKey] = true;

              //console.log(garageKey,customerKey,updates);

              admin.database().ref().update(updates);
            
            })
            

            
            
            
            //console.log(x[0],nCustomer);
            

            admin.database().ref('/customers/'+customerKey).update(nCustomer)

          }

          i++ 

        })
        


        setTimeout(()=>{

          const objCheckGarage = {
            uid: uid,
            createdAt: now,
            garagesUpdated,
            garagesNew
          }
         
  
          const response = {
  
            success:true,
            garagesUpdated,
            garagesNew
  
          }
  
          admin.database().ref('/checkGarage/'+checksGarageKey).update(objCheckGarage)

          return res.status(200).json(response)

        },5000)

       



        

      }

    })




  } catch(ex) {

    console.error(ex)

    return res.status(500).json({ error: ex })

  }

}



async function writeMassiveGarages(req, res) {

  try {

    var garagesRef = admin.database().ref("/garages")

    const c = await fs.readFileSync(req.files.csvFile.path, "utf8")

    const d = papaparse.parse(c, {

      complete: result => {

        const now = moment().unix()


        const uid = req.body.uid

        var i = 0

        result.data.forEach(x => {

          

          if(x[0]){

            

            

            let telefonosArray = []



            if(x[4] != '' ) telefonosArray.push(x[4])

            if(x[5] != '' ) telefonosArray.push(x[5])

            if(x[6] != '' ) telefonosArray.push(x[6])



            const Garage = {

              //codigo:x[0],

              nombre:x[1] || null,

              propietario:x[2] || null,

              direccion:x[3] || null,

              telefonos:telefonosArray,

              zona:x[7] || null

            }

            console.log(x[0],Garage);
            

            admin.database().ref('/garages/'+x[0]).update(Garage)

          }



          i++ 





        })

        

        const response = {

          success:true,
          i,

        }



        return res.status(200).json(response)

      }

    })

  } catch(ex) {

    console.log(ex);

    

    

    return res.status(500).json({ error: ex })

  }

}


async function testGarages (req, res) {

  const test = '123'
  let result
  if(Number.parseInt(test))
  result = Number.parseInt(test) + " Si es entero"
  else
  result = Number.parseInt(test) +  'No es entero'



  

  res.send('OK Test Garages: '+result)
}



module.exports = { writeMassiveGarages, updateGarages, testGarages }