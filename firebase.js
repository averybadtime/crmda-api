var admin = require("firebase-admin")
var serviceAccount = require("./serviceAccountDEV.json")


// var configDEV = {
//     apiKey: "AIzaSyBSGbX_JEGXrhLFg30FFo9QwsbI1uCCsPM",
//     authDomain: "dev-crmd.firebaseapp.com",
//     databaseURL: "https://dev-crmd.firebaseio.com",
//     projectId: "dev-crmd",
//     storageBucket: "dev-crmd.appspot.com",
//     messagingSenderId: "802603183094"
// };


admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://dev-crmd.firebaseio.com"
})



// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount),
// 	databaseURL: "https://crm-diagnostiautos.firebaseio.com/"
// })

//https://crm-diagnostiautos.firebaseio.com/
//https://dev-crmd.firebaseio.com

module.exports = admin