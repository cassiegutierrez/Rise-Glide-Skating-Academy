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

let auth = null;
let db = null;

if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
  } catch (e) {
    console.warn('Firebase initialization error:', e);
  }
} else {
  console.warn('Firebase SDK not loaded. Include the Firebase scripts in your HTML.');
}

// LOGIN
function login() {
  const emailEl = document.getElementById("email");
  const passwordEl = document.getElementById("password");
  const errEl = document.getElementById("error");
  const email = emailEl ? emailEl.value : '';
  const password = passwordEl ? passwordEl.value : '';

  if (!auth) {
    if (errEl) errEl.innerText = 'Authentication is not available.';
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = "dashboard.html")
    .catch(err => {
      if (errEl) errEl.innerText = err.message;
    });
}

// LOGOUT
function logout() {
  if (!auth) { window.location.href = "login.html"; return; }
  auth.signOut().then(() => window.location.href = "login.html");
}

// AUTH STATE HANDLING
if (auth) {
  auth.onAuthStateChanged(user => {
    const onDashboard = window.location.pathname.includes('dashboard') || window.location.href.includes('dashboard');
    const onLogin = window.location.pathname.includes('login') || window.location.href.includes('login');

    if (!user && onDashboard) {
      window.location.href = "login.html";
      return;
    }

    if (user && onLogin) {
      window.location.href = "dashboard.html";
      return;
    }

    if (user && onDashboard) {
      loadDashboard();
    }
  });
}

// LOAD DASHBOARD DATA
function loadDashboard() {
  if (!db) { console.warn('Firestore not initialized. Skipping dashboard load.'); return; }

  const competitionsEl = document.getElementById('competitions');
  const todosEl = document.getElementById('todos');
  const paymentsEl = document.getElementById('payments');
  const filesEl = document.getElementById('files');

  db.collection("competitions").get().then(snapshot => {
    if (competitionsEl) competitionsEl.innerHTML = snapshot.docs.map(doc => `<p>${doc.data().name}</p>`).join("");
  }).catch(e => console.warn('Error loading competitions:', e));

  db.collection("todos").get().then(snapshot => {
    if (todosEl) todosEl.innerHTML = snapshot.docs.map(doc => `<p>☐ ${doc.data().task}</p>`).join("");
  }).catch(e => console.warn('Error loading todos:', e));

  db.collection("payments").get().then(snapshot => {
    if (paymentsEl) paymentsEl.innerHTML = snapshot.docs.map(doc =>
      `<p><a href="${doc.data().link}" target="_blank">${doc.data().name}</a></p>`
    ).join("");
  }).catch(e => console.warn('Error loading payments:', e));

  db.collection("files").get().then(snapshot => {
    if (filesEl) filesEl.innerHTML = snapshot.docs.map(doc =>
      `<p><a href="${doc.data().link}" target="_blank">${doc.data().name}</a></p>`
    ).join("");
  }).catch(e => console.warn('Error loading files:', e));
}
