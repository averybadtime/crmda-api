const papaparse = require("papaparse")
const fs = require("fs")
const moment = require("moment")

const patterns = {
	nombre: new RegExp("^[a-zA-ZÑñ]+(([',. -][a-zA-Z ])?[a-zA-ZÑñ]*)*$"),
	alfabetico: new RegExp("^[a-zA-Z\s]*$"),
	alfanumerico: new RegExp("^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$"),
	numerico: new RegExp("^[0-9]*$")
}

async function validate(file) {
	try {
		const c = await fs.readFileSync(file.path, "latin1")
		const  { data } = papaparse.parse(c, {
			complete: result => result
		})

		let response = {
			approved: 0,
			rejected: 0,
			warnings: [],
			errors: []
		}

		for (let i in data) {
			let phones = 0
			let names = 0
			let rowWarnings = {}
			let rowErrors = {}

			// Fecha RTM
			const fecha = data[i][0]
			if (fecha !== "") {
				if (moment(fecha, "DD/MM/YYYY").isValid() === false) {
					rowErrors["fechaRtm"] = "La fecha especificada no es válida."
				}
			} else {
				rowWarnings["fechaRtm"] = "No se especificó FECHA RTM."
			}

			// Nombre
			const nombre = data[i][1]
			if (nombre === "") {
				rowErrors["nombreCliente"] = "No se especificó NOMBRE CLIENTE."
			} else {
				names++
			}

			// Placa
			const placa = data[i][2]
			if (placa !== "") {
				if (patterns.alfanumerico.test(placa) === false) {
					rowErrors["placa"] = "La placa especificada no es válida."
				} else {
					if (placa.length < 5 || placa.length > 6) {
						rowErrors["placa"] = "La placa debe contener entre 5 y 6 caracteres."
					}
				}
			} else {
				rowErrors["placa"] = "No se especificó PLACA."
			}

			// Certificado
			const certificado = data[i][3]
			if (certificado !== "") {
				if (patterns.numerico.test(certificado) === false) {
					rowErrors["certificado"] = "El certificado especificado no es válido."
				} else {
					if (certificado === "0") {
						response.rejected++
					} else {
						response.approved++
					}
				}
			} else {
				response.rejected++
			}

			// Cédula
			const cedula = data[i][4]
			if (cedula !== "") {
				if (patterns.numerico.test(cedula) === false) {
					rowErrors["cedula"] = "La cédula especificada no es válida."
				} else {
					if (cedula.length > 10) {
						rowErrors["cedula"] = "La cédula debe contener máximo 10 caracteres."
					}
				}
			} else {
				rowErrors["cedula"] = "No se especificó CEDULA."
			}

			// Dirección


			// Celular
			const celular = data[i][6]
			if (celular !== "") {
				if (patterns.numerico.test(celular) === false) {
					rowErrors["celularCliente"] = "El número de celular especificado no es válido."
				} else {
					if (celular.length !== 10) {
						rowErrors["celularCliente"] = "El número de celular debe contener 10 dígitos"
					} else {
						const celularInt = parseInt(celular)
						if (celularInt < 3000000000 || celularInt > 3999999999) {
							rowErrors["celularCliente"] = "El número de celular especificado no es válido."
						} else {
							phones++
						}
					}
				}
			}

			// Marca
			const marca = data[i][7]
			if (marca !== "") {
				if (patterns.alfanumerico.test(marca) === false) {
					rowWarnings["marca"] = "Se especificó una marca que contiene números."
				}
			} else {
				rowWarnings["marca"] = "No se especificó MARCA."
			}

			// Linea
			const linea = data[i][8]
			if (linea !== "") {
				if (patterns.alfanumerico.test(linea) === false) {
					rowErrors["linea"] = "La linea no debe contener caracteres especiales."
				}
			} else {
				rowWarnings["linea"] = "No se especificó LINEA."
			}

			// Tipo de servicio
			const tipoServicio = data[i][9]
			if (tipoServicio !== "") {
				if (patterns.alfanumerico.test(tipoServicio) === false) {
					rowWarnings["tipoServicio"] = "El tipo de servicio no puede contener caracteres especiales."
				}
			} else {
				rowWarnings["tipoServicio"] = "No se especificó TIPO DE SERVICIO."
			}

			// Tipo de vehículo
			const tipoVehiculo = data[i][10]
			if (tipoVehiculo !== "") {
				if (patterns.alfanumerico.test(tipoVehiculo) === false) {
					rowWarnings["tipoVehiculo"] = "El tipo de vehículo no debe contener caracteres especiales."
				}
			} else {
				rowWarnings["tipoVehiculo"] = "No se especificó TIPO DE VEHÍCULO."
			}

			// Modelo
			const modelo = data[i][11]
			if (modelo !== "") {
				if (patterns.numerico.test(modelo) === false) {
					rowErrors["modelo"] = "El modelo especificado no es válido."
				} else {
					if (modelo.length !== 4) {
						rowErrors["modelo"] = "El modelo especificado no es válido."
					} else {
						const modeloInt = parseInt(modelo)
						if (modeloInt < 1900 || modeloInt > 2100) {
							rowErrors["modelo"] = "El modelo debe ser menor a 2100 y mayor a 1900"
						}
					}
				}
			} else {
				rowWarnings["modelo"] = "No se especificó MODELO."
			}

			// Telefono fijo
			const telefonoFijo = data[i][12]
			if (telefonoFijo !== "") {
				if (patterns.numerico.test(telefonoFijo) === false) {
					rowErrors["telefonoFijoCliente"] = "El número de teléfono fijo especificado no es válido."
				} else {
					if (telefonoFijo.length !== 7) {
						rowErrors["telefonoFijoCliente"] = "El número de teléfono fijo debe contener 7 dígitos"
					} else {
						phones++
					}
				}
			}

			// Poseedor
			const nombrePoseedor = data[i][1]
			if (nombrePoseedor === "") {
				rowErrors["nombrePoseedor"] = "No se especificó NOMBRE DEL POSEEDOR."
			} else {
				names++
			}

			// Celular del poseedor
			const celularPoseedor = data[i][14]
			if (celularPoseedor !== "") {
				if (patterns.numerico.test(celularPoseedor) === false) {
					rowErrors["celularPoseedor"] = "El número de celular del poseedor especificado no es válido."
				} else {
					if (celularPoseedor.length < 7 || celularPoseedor.length > 10) {
						rowErrors["celularPoseedor"] = "El número de celular del poseedor especificado no es válido."
					} else {
						phones++
					}
				}
			}

			if (phones === 0) {
				rowErrors["noRegistraTelefono"] = "No registró al menos un número de teléfono."
			}

			if (names === 0) {
				rowErrors["noRegistraNombre"] = "No registró al menos un nombre."
			}

			const rowNumber = +i+1
			const fila = `Fila-${ rowNumber }`
			if (Object.keys(rowWarnings).length > 0) response.warnings.push({ fila, warnings: rowWarnings })
			if (Object.keys(rowErrors).length > 0) response.errors.push({ fila, errors: rowErrors })
		}

		return response
	} catch (ex) {
		res.status(500).send({ error: "Ocurrió un error al validar el archivo en el servidor, intente de nuevo en unos momentos." })
	}
}

module.exports = {
	validate
}