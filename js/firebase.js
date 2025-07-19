const firebaseConfig = {
  apiKey: "AIzaSyD3sCaLCcJW4htEGkyVuaIHuM5hMMF2l2s",
  authDomain: "bumpifylive-dd3da.firebaseapp.com",
  projectId: "bumpifylive-dd3da",
  storageBucket: "bumpifylive-dd3da.firebasestorage.app",
  messagingSenderId: "359364471034",
  appId: "1:359364471034:web:7fa6710703ddad81964143",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
