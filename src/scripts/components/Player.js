import { renderTrackList } from "./TrackList.js";
import { setupProgressBar } from "./ProgressBar.js";
import { loadTrack } from "../utils/player-utils.js";
import { togglePlayPause } from "../utils/player-utils.js";

export class PlayerState {
  constructor(tracks) {
    this.audio = new Audio();
    this.tracks = tracks;
    this.currentIndex = 0;
    this.isPlaying = false;
  }

  get currentTrack() {
    return this.tracks[this.currentIndex];
  }
}

export function initPlayer(tracks) {
  const state = new PlayerState(tracks);
  const playerElement = document.getElementById("app");

  // инициализация компонента
  renderTrackList(state);
  setupProgressBar(state);
  setupPlayerControls(state);

  // загрузка первого трека
  loadTrack(state);

  return state;
}

function setupPlayerControls(state) {
  const playBtn = document.getElementById("mainPlay");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  playBtn.addEventListener("click", () =>
    togglePlayPause(state),
  );
  prevBtn.addEventListener("click", () => prevTrack(state));
  nextBtn.addEventListener("click", () => nextTrack(state));
}

function nextTrack(state) {
  state.currentIndex =
    (state.currentIndex + 1) % state.tracks.length;
  loadTrack(state);
  if (state.isPlaying) {
    state.audio
      .play()
      .catch((error) =>
        console.error("Playback error:", error),
      );
  }
}

function prevTrack(state) {
  if (state.audio.currentTime > 3) {
    state.audio.currentTime = 0;
    return;
  }
  state.currentIndex =
    (state.currentIndex - 1 + state.tracks.length) %
    state.tracks.length;
  loadTrack(state);
  if (state.isPlaying) {
    state.audio
      .play()
      .catch((error) =>
        console.error("Playback error:", error),
      );
  }
}
