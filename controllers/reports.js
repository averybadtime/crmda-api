var admin = require("../firebase")
var groupArray = require("group-array")

const customersRef = admin.database().ref("/customers")

function getObjectByRTMLocation(req, res) {
	const start = req.query.start
	const end = req.query.end

	customersRef.orderByChild("fechaRtm2018Unix")
		.startAt(start)
		.endAt(end)
		.once("value")
		.then(snapshot => {
			const array = Object.values(snapshot.val())
			const arrayData = groupArray(array, "location", "rtm")
			res.status(200).json({ data: arrayData })
		})
		.catch(err => {
			console.error(err)
			res.status(500).json({ error: err })
		})
}

function getObjectByLocation(req, res) {
	const start = req.query.start
	const end = req.query.end

	customersRef.orderByChild("fechaRtm2017Unix")
		.startAt(start)
		.endAt(end)
		.once("value")
		.then(snapshot => {
			const array = Object.values(snapshot.val())
			const arrayData = groupArray(array, "location")

			res.status(200).json({ results: arrayData })
		})
		.catch(err => {
			console.error(err)
			res.status(500).json({ error: err })
		})
}

function getRTMPerdidas(req, res) {
	const start = req.query.start
	const end = req.query.end

	customersRef.orderByChild("fechaRtmVencidaUnix")
		.startAt(start)
		.endAt(end)
		.once("value")
		.then(snapshot => {
			const array = Object.values(snapshot.val())
			const arrayData = groupArray(array, "accion")

			return res.status(200).json({ results: arrayData })
		})
		.catch(err => {
			console.error(err)
			res.status(500).json({ error: err })
		})
}

module.exports = {
	getObjectByRTMLocation, getObjectByLocation, getRTMPerdidas
}