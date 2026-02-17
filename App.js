// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUin7iBfZHmPTfyOEyeKyNrxTPaRI-xyI",
  authDomain: "rise-glide-skating.firebaseapp.com",
  projectId: "rise-glide-skating",
  storageBucket: "rise-glide-skating.firebasestorage.app",
  messagingSenderId: "172851034243",
  appId: "1:172851034243:web:c2311503213283c36483b6",
  measurementId: "G-7PBPRL15QP"
};
const firebaseConfig = {
  apiKey: "YOUR-KEY",
  authDomain: "YOUR-DOMAIN",
  projectId: "YOUR-ID",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = "dashboard.html")
    .catch(err => document.getElementById("error").innerText = err.message);
}

// LOGOUT
function logout() {
  auth.signOut().then(() => window.location.href = "login.html");
}

// PROTECT DASHBOARD
auth.onAuthStateChanged(user => {
  if (!user && window.location.pathname.includes("dashboard")) {
    window.location.href = "login.html";
  } else {
    loadDashboard();
  }
});

// LOAD DASHBOARD DATA
function loadDashboard() {

  db.collection("competitions").get().then(snapshot => {
    competitions.innerHTML = snapshot.docs.map(doc => `<p>${doc.data().name}</p>`).join("");
  });

  db.collection("todos").get().then(snapshot => {
    todos.innerHTML = snapshot.docs.map(doc => `<p>☐ ${doc.data().task}</p>`).join("");
  });

  db.collection("payments").get().then(snapshot => {
    payments.innerHTML = snapshot.docs.map(doc =>
      `<p><a href="${doc.data().link}" target="_blank">${doc.data().name}</a></p>`
    ).join("");
  });

  db.collection("files").get().then(snapshot => {
    files.innerHTML = snapshot.docs.map(doc =>
      `<p><a href="${doc.data().link}" target="_blank">${doc.data().name}</a></p>`
    ).join("");
  });

}
