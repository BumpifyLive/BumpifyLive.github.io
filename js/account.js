const BUMP_COOLDOWN_HOURS = 2;

auth.onAuthStateChanged(user => {
  if (!user) return;

  const form = document.getElementById("addStreamForm");
  const myStreams = document.getElementById("myStreams");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const url = document.getElementById("streamUrl").value;
    const game = document.getElementById("game").value;
    const description = document.getElementById("description").value;

    db.collection("streams").add({
      url,
      game,
      description,
      title: game,
      platform: "twitch",
      createdAt: firebase.firestore.Timestamp.now(),
      lastBumped: firebase.firestore.Timestamp.now(),
      bumpCount: 0,
      bumpedBy: [],
      userId: user.uid,
      userDisplayName: user.displayName,
      userEmail: user.email,
      userPhoto: user.photoURL
    }).then(() => {
      form.reset();
    });
  });

  db.collection("streams")
    .where("userId", "==", user.uid)
    .onSnapshot(snapshot => {
      myStreams.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const now = new Date();
        const lastBump = data.lastBumped?.toDate() || new Date(0);
        const hoursSince = (now - lastBump) / (1000 * 60 * 60);
        const canBump = hoursSince >= BUMP_COOLDOWN_HOURS;
        const timeLeft = Math.ceil(BUMP_COOLDOWN_HOURS - hoursSince);

        const div = document.createElement("div");
        div.classList.add("stream-card");
        div.innerHTML = `
          <img src="${data.userPhoto}" alt="pfp">
          <h3>${data.userDisplayName}</h3>
          <p>${data.description}</p>
          <a href="${data.url}" target="_blank">Watch Streamer</a><br>
          <button onclick="deleteStream('${doc.id}')">Delete</button>
          <button onclick="bumpStream('${doc.id}')" ${!canBump ? "disabled" : ""}>
            ${canBump ? "Bump" : `Wait ${timeLeft}h`}
          </button>
        `;
        myStreams.appendChild(div);
      });
    });
});

function bumpStream(id) {
  const ref = db.collection("streams").doc(id);
  ref.get().then(doc => {
    const data = doc.data();
    const last = data.lastBumped?.toDate() || new Date(0);
    const hoursSince = (new Date() - last) / (1000 * 60 * 60);
    if (hoursSince < BUMP_COOLDOWN_HOURS) return;

    ref.update({
      lastBumped: firebase.firestore.Timestamp.now(),
      bumpCount: (data.bumpCount || 0) + 1
    });
  });
}

function deleteStream(id) {
  if (confirm("Delete this stream?")) {
    db.collection("streams").doc(id).delete();
  }
}
