import { secondsToMinutes } from "./helpers";

export function loadTrack(state) {
  const track = state.currentTrack;
  state.audio.src = track.audio;

  document.getElementById("artist").textContent =
    track.artist_name;
  document.getElementById("song").textContent = track.name;
  document.getElementById("mainTimer").textContent =
    secondsToMinutes(track.duration);
}

export function togglePlayPause(state) {
  if (state.audio.paused) {
    state.audio
      .play()
      .then(() => {
        state.isPlaying = true;
        updatePlayButton(state);
      })
      .catch((error) =>
        console.error("Playback error:", error),
      );
  } else {
    state.audio.pause();
    state.isPlaying = false;
    updatePlayButton(state);
  }
}

export function updatePlayButton(state) {
  const playBtn = document.getElementById("mainPlay");
  if (!playBtn) return;

  playBtn.classList.toggle("play", !state.isPlaying);
  playBtn.classList.toggle("pause", state.isPlaying);
}
