import { secondsToMinutes } from "../utils/helpers.js";
import {
  loadTrack,
  togglePlayPause,
} from "../utils/player-utils.js";

export function renderTrackList(state) {
  const trackListElement = document.querySelector(
    ".player__tracklist",
  );
  trackListElement.innerHTML = "";

  state.tracks.forEach((track, index) => {
    const trackElement = document.createElement("div");
    trackElement.className = "tracklist__item";
    trackElement.innerHTML = `
        <span class="tracklist__info">${
          track.artist_name
        } - ${track.name}</span>
        <div class="tracklist__duration">${secondsToMinutes(
          track.duration,
        )}</div>
    `;

    // клик по треку
    trackElement.addEventListener("click", () => {
      // обновляем текущий трек
      state.currentIndex = index;

      // загружаем выбранный трек
      loadTrack(state);
      // запускаем выбранный трек
      togglePlayPause(state);
    });

    trackListElement.appendChild(trackElement);
  });
}
