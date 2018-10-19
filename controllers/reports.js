var admin = require("../firebase")
var groupArray = require("group-array")
const customersRef = admin.database().ref("/customers")
async function getObjectByRTMLocation(req, res) {
    const start = req.body.start
    const end = req.body.end
		let ObjectByRtmLocation2018_2 = {}
		let ObjectByRtmLocationSource = {}
    let dataSet = []
    const result2018 = await customersRef.orderByChild("fechaRtm2018Unix").startAt(start).endAt(end).once("value").then(snapshot => {
        const data = snapshot.val()
        //console.log('data2018', data)
        if (data !== null) {
            const array = Object.values(snapshot.val())
						const arrayData = groupArray(array, "location", "rtm")
						let arrayDataSource = groupArray(array, "sourceKey", "location")

						ObjectByRtmLocationSource = arrayDataSource

						for (let locationKey in arrayDataSource){

							
							
							for (let sourceKey in arrayDataSource[locationKey]){
								ObjectByRtmLocationSource[locationKey][sourceKey] = arrayDataSource[locationKey][sourceKey].length
								//console.log(locationKey,sourceKey,arrayDataSource[locationKey][sourceKey].length);
								
							}
						}

					//	console.log(ObjectByRtmLocationSource);
						
						
						let arrayObj = {}
						
            for (const key in arrayData) {


							let rtmTalleres2018 = 0
							let rtmTalleresNuevos = 0


							arrayData[key].customer_new.forEach(element => {
								if(element.garageKey){
									rtmTalleresNuevos ++
									//console.log(key,'SI existente', rtmTalleresNuevos);
								}else{
									//console.log(key,'No taller, existente');									
								}
							});

							arrayData[key].customer_exist.forEach(element => {								
								if(element.garageKey){
									rtmTalleres2018 ++								
								}else{
									//console.log(key,'No taller, en new');									
								}								
							});

							

							
							
                const rtm2018 = arrayData[key].customer_exist ? arrayData[key].customer_exist.length : 0
                const rtmNuevas = arrayData[key].customer_new ? arrayData[key].customer_new.length : 0
								const rtm2017 = 0
							
                arrayObj[key] = {
                    rtm2017,
                    rtm2018,
										rtmNuevas,
										rtmTalleres2018,
										rtmTalleresNuevos,
										
                }
            }
            ObjectByRtmLocation2018_2 = arrayObj
           //console.log('GroupArraySourceKey', arrayDataSource);
           // console.log('objectByRtm', ObjectByRtmLocation2018_2)
        }
    }).catch(err => {
        console.error(err)
        res.status(500).json({
            error: err
        })
    })
    let start2017 = req.body.start2017
    let end2017 = req.body.end2017
    //console.log('fechas 2017', start2017, end2017)
    const resultLastYear = await customersRef.orderByChild('fechaRtmBDUnix').startAt(start2017).endAt(end2017).once('value').then(snapshot => {
        const data = snapshot.val()
        //console.log('data2017', data)
        if (data != null) {
            const array = Object.values(data)
            let ObjArray = groupArray(array, 'location')
            for (const key in ObjArray) {
                if (!ObjectByRtmLocation2018_2[key]) {
                    //console.log('Creamos el rtm2017');
                    ObjectByRtmLocation2018_2[key] = {
                        rtm2017: 0,
                        rtm2018: 0,
                        rtmNuevas: 0
                    }
                }
                //console.log('fechaRtmBDUnix', key, ObjectByRtmLocation2018_2[key]);
                ObjectByRtmLocation2018_2[key].rtm2017 = ObjArray[key].length
                dataSet.push(ObjectByRtmLocation2018_2[key].rtm2018)
                //console.log('object2', ObjectByRtmLocation2018_2)
            }
        }
        //console.log('dataset', dataSet);
        return res.status(200).json({
            results: ObjectByRtmLocation2018_2,
						dataSet,
						localhost: 'OK',
						ObjectByRtmLocationSource
        })
    })
    setTimeout(() => {
        console.log('ObjectByRtmLocation2018_2', ObjectByRtmLocation2018_2)
    }, 5000)
}

function getRTMPerdidas(req, res) {
    const start = req.body.start
    const end = req.body.end
    var ObjectByAccionRtmPerdidas = {}
    var totalAccionRtmPerdida = 0
    let arrayNoRtm = []
    let groupArrayNoRtm = []
    customersRef.orderByChild("fechaRtmVencidaUnix").startAt(start).endAt(end).once("value").then(snapshot => {
        const data = snapshot.val()
        if (data !== null) {
            const array = Object.values(snapshot.val())
            const arrayData = groupArray(array, "accion", "location")
            let rtmPerdidas = 0
            let ArrayNoRtmByLocation = []
            let ArrayNoRtmMotivos = {}
            for (const key in arrayData) {
                if (key != 'cargado' && key != 'post_venta') {
                    let rtmPerdidasByLocation = 0
                    let rtmNoRtm = 0
                    ObjectByAccionRtmPerdidas[key] = {}
                    for (const key2 in arrayData[key]) {
                        const rtmByLocation = arrayData[key][key2].length
                        ObjectByAccionRtmPerdidas[key][key2] = rtmByLocation
                        rtmPerdidasByLocation += rtmByLocation
                        if (key == 'no_rtm') {
                            for (const key3 in arrayData[key][key2]) {
                                const lastLogStatus = arrayData[key][key2][key3].logStatus.slice(-1)[0]
                                arrayNoRtm.push(lastLogStatus)
                                ArrayNoRtmByLocation.push({
                                    'placa': lastLogStatus.customerKey,
                                    'sede': key2,
                                    'motivo': lastLogStatus.motivo,
                                    'user': lastLogStatus.ucode,
                                    'comentario': lastLogStatus.comment,
                                })
                            }
                        }
                    }
                    ObjectByAccionRtmPerdidas[key].TotalPerdidaLocacion = rtmPerdidasByLocation
                    totalAccionRtmPerdida += rtmPerdidasByLocation
                }
            }
						groupArrayNoRtm = groupArray(arrayNoRtm, "motivo")
						//const groupArrayNoRtmSede = groupArray(arrayNoRtm, "motivo","sede")

            return res.status(200).json({
                results: ObjectByAccionRtmPerdidas,
                total: totalAccionRtmPerdida,
                groupArrayNoRtm,
								ArrayNoRtmByLocation,
								//groupArrayNoRtmSede
            })
        }
        return res.status(200).json({
            results: null
        })
    }).catch(err => {
        console.error(err)
        return res.status(500).json({
            error: err
        })
    })
}
module.exports = {
    getObjectByRTMLocation,
    getRTMPerdidas
}