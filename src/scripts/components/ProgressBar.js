export function setupProgressBar(state) {
  const progressbar = document.getElementById("duration");
  const bar = document.getElementById("progressbar");
  const timer = document.getElementById("mainTimer");

  // обновление прогрессбра во время воспроизведения
  state.audio.addEventListener("timeupdate", () => {
    const progress =
      (state.audio.currentTime / state.audio.duration) *
      100;
    bar.style.width = `${progress}%`;
    timer.textContent = formatTime(state.audio.currentTime);
  });

  // перемотка трека по клику
  progressbar.addEventListener("click", (e) => {
    const percent = e.offsetX / progressbar.offsetWidth;
    state.audio.currentTime =
      percent * state.audio.duration;
    bar.style.width = `${percent * 100}%`;
  });
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}
