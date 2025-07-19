function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(() => location.reload())
    .catch(err => console.error('Login error', err));
}

function signOut() {
  auth.signOut().then(() => location.reload());
}
