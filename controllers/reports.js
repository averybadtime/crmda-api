var admin = require("../firebase")
var groupArray = require("group-array")

const customersRef = admin.database().ref("/customers")

// function getObjectByRTMLocation(req, res) {
// 	const start = req.body.start
// 	const end = req.body.end

// 	customersRef.orderByChild("fechaRtm2018Unix")
// 		.startAt(start)
// 		.endAt(end)
// 		.once("value")
// 		.then(snapshot => {
// 			const data = snapshot.val()

// 			if (data !== null) {
// 				const array = Object.values(data)
// 				const arrayData = groupArray(array, "location", "rtm")
// 				return res.status(200).json({ results: arrayData })
// 			}
// 			res.status(200).json({ results: null })
// 		})
// 		.catch(err => {
// 			console.error(err)
// 			res.status(500).json({ error: err })
// 		})
// }

function getObjectByRTMLocation(req, res) {
	const start = req.body.start
	const end = req.body.end

	let ObjectByRtmLocation2018_2 = {}

	let dataSet = []

	console.log('getObjectByRTMLocation',start,end);
	

	customersRef.orderByChild("fechaRtm2018Unix")
		.startAt(start)
		.endAt(end)
		.once("value")
		.then(snapshot => {
			const data = snapshot.val()
			if (data !== null) {
				const array = Object.values(snapshot.val())
				const arrayData = groupArray(array, "location", "rtm")


				let arrayObj = {}

				for(const key in arrayData){
					const rtm2018 = arrayData[key].customer_exist.length
					const rtmNuevas = arrayData[key].customer_new.length										
					const rtm2017 = 0

					arrayObj[key] = {rtm2017, rtm2018, rtmNuevas}
				}

				ObjectByRtmLocation2018_2 = arrayObj

				//console.log(ObjectByRtmLocation2018_2);								

				dataSet = [
					arrayObj['diagnostiautos'].rtm2018,
					arrayObj['la_paz'].rtm2018,
					arrayObj['revimoto_1a'].rtm2018,
					arrayObj['supermotos'].rtm2018
				]

				

				// return res.status(200).json({ results: ObjectByRtmLocation2018_2, dataSet })
			}
			// res.status(200).json({ results: null })
		})
		.catch(err => {
			console.error(err)
			res.status(500).json({ error: err })
		})


		const start2017 = req.body.start2017
		const end2017 = req.body.end2017
		

		customersRef.orderByChild('fechaRtm2017Unix')
			.startAt(start2017)
			.endAt(end2017)
			.once('value')
			.then(snapshot=>{

				const data = snapshot.val()

				if(data != null){
							
					const array = Object.values(data)

					let ObjArray = groupArray(array, 'location')	

					for (const key in ObjArray){
						ObjectByRtmLocation2018_2[key].rtm2017 =  ObjArray[key].length

						console.log('fechaRtm2017Unix',key, ObjectByRtmLocation2018_2[key]);
					}	

				}
				return res.status(200).json({ results: ObjectByRtmLocation2018_2, dataSet })
				//res.status(200).json({ results: null })
		})	


}

function getRTMPerdidas(req, res) {
	const start = req.body.start
	const end = req.body.end

	var ObjectByAccionRtmPerdidas = {}
	var totalAccionRtmPerdida = 0

	let arrayNoRtm = []

	let groupArrayNoRtm = []

	//console.log('OK');
	

	customersRef.orderByChild("fechaRtmVencidaUnix")
		.startAt(start)
		.endAt(end)
		.once("value")
		.then(snapshot => {
			const data = snapshot.val()

			//console.log(start,end, snapshot.val());
			

			if (data !== null) {
				const array = Object.values(snapshot.val())
				const arrayData = groupArray(array, "accion", "location")
				let rtmPerdidas = 0

				let ArrayNoRtmByLocation = []
				let ArrayNoRtmMotivos = {}


				//ArrayRtmPerdidas
				for(const key in arrayData){

					if(key != 'cargado' && key != 'post_venta'){
						let rtmPerdidasByLocation = 0
						let rtmNoRtm = 0
						

						ObjectByAccionRtmPerdidas[key] = {}

						for(const key2	in arrayData[key]){

							const rtmByLocation = arrayData[key][key2].length
							ObjectByAccionRtmPerdidas[key][key2] = rtmByLocation

							rtmPerdidasByLocation += rtmByLocation

							if(key == 'no_rtm'){
								for(const key3 in arrayData[key][key2]){

									const lastLogStatus = arrayData[key][key2][key3]['logStatus'].slice(-1)[0]

									// Se Crea el key si no existe
									// if(!ArrayNoRtmByLocation[key2]){										
									// 	ArrayNoRtmByLocation[key2] = []
									// }
										
									arrayNoRtm.push(lastLogStatus)

									ArrayNoRtmByLocation.push({
										'placa': lastLogStatus['customerKey'],
										'sede': key2,
										'motivo': lastLogStatus['motivo'],
										'user': lastLogStatus['ucode'],										
										'comentario': lastLogStatus['comment'],
									})

								
									
								}

							}
							//console.log(key);
							
						}	
						
						// console.log('getRTMPerdidas',arrayNoRtm);
						
						
						ObjectByAccionRtmPerdidas[key]['TotalPerdidaLocacion'] = rtmPerdidasByLocation																
					
						totalAccionRtmPerdida += rtmPerdidasByLocation 
					}									
					
				}

				groupArrayNoRtm = groupArray(arrayNoRtm, "motivo")

				// console.log(ObjectByAccionRtmPerdidas);
				

				return res.status(200).json({ results: ObjectByAccionRtmPerdidas, total: totalAccionRtmPerdida,  groupArrayNoRtm, ArrayNoRtmByLocation })
			}
			return res.status(200).json({ results: null })
		})
		.catch(err => {
			console.error(err)
			return res.status(500).json({ error: err })
		})
}

// function getRTMPerdidas(req, res) {
// 	const start = req.body.start
// 	const end = req.body.end

// 	customersRef.orderByChild("fechaRtmVencidaUnix")
// 		.startAt(start)
// 		.endAt(end)
// 		.once("value")
// 		.then(snapshot => {
// 			const data = snapshot.val()

// 			if (data !== null) {
// 				const array = Object.values(snapshot.val())
// 				const arrayData = groupArray(array, "accion")
// 				return res.status(200).json({ results: arrayData })
// 			}
// 			res.status(200).json({ results: null })
// 		})
// 		.catch(err => {
// 			console.error(err)
// 			res.status(500).json({ error: err })
// 		})
// }



module.exports = {
	getObjectByRTMLocation, 
	// getObjectByLocation, 
	getRTMPerdidas
	
}