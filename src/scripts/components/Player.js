import { renderTrackList } from "./TrackList.js";
import { setupProgressBar } from "./ProgressBar.js";
import {
  setupDropzone,
  setupFileInput,
} from "./Dropzone.js";

export class PlayerState {
  constructor(tracks = []) {
    this.audio = new Audio();
    this.tracks = tracks;
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isLoading = false;

    // обработчики событий аудио
    // проигрывание текущего трека закончилось
    this.audio.addEventListener("ended", () =>
      this.handleTrackEnd(),
    );
    // загрузились все метаданные трека
    this.audio.addEventListener("loadedmetadata", () => {
      this.handleLoaded();
    });
    // ошибка плеера
    this.audio.addEventListener("error", (e) => {
      this.isLoading = false;
      this.handleError(e);
    });
  }

  // текущий трек
  get currentTrack() {
    return this.tracks[this.currentIndex];
  }

  // загрузка трека
  async loadTrack() {
    if (!this.currentTrack || this.isLoading) return;

    this.isLoading = true;
    this.updatePlayButton();

    try {
      // сброс текущего воспроизведения
      this.audio.pause();
      this.audio.src = "";

      // установка нового источника
      this.audio.src = this.currentTrack.audio;
      this.audio.load();

      // обновление UI
      document.getElementById("artist").textContent =
        this.currentTrack.artist_name;
      document.getElementById("song").textContent =
        this.currentTrack.name;
      document.getElementById("mainTimer").textContent =
        this.secondsToMinutes(this.currentTrack.duration);

      // ожидание готовности трека
      await new Promise((resolve) => {
        this.audio.addEventListener(
          "canplaythrough",
          resolve,
          { once: true },
        );
      });
    } catch (error) {
      console.error("Track loading error:", error);
    } finally {
      this.isLoading = false;
    }
  }

  // запуск проигрывания
  async play() {
    if (!this.currentTrack || this.isLoading) return;

    this.shouldAutoPlay = true;
    try {
      await this.audio.play();
      this.isPlaying = true;
      this.updatePlayButton();
    } catch (error) {
      console.error("Playback error:", error);
      this.isPlaying = false;
      this.updatePlayButton();
    }
  }

  // остановка проигрывания
  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayButton();
  }

  // переключение на следующий трек
  async nextTrack() {
    // если песни закончились, ничего не загружаем, не запускаем
    if (this.tracks.length === 0) return;

    const shouldAutoPlay = this.isPlaying;
    this.isPlaying = false;
    this.updatePlayButton();

    this.currentIndex =
      (this.currentIndex + 1) % this.tracks.length;
    this.shouldAutoPlay = this.isPlaying;
    await this.loadTrack();

    if (shouldAutoPlay) {
      await this.play();
    }
  }

  // переключение на предыдущий трек
  async prevTrack() {
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }

    this.currentIndex =
      (this.currentIndex - 1 + this.tracks.length) %
      this.tracks.length;
    await this.loadTrack();
    if (this.isPlaying) await this.play();
  }

  // завершение текущего трека
  handleTrackEnd() {
    // Проверяем, что плеер был активен, переключение на следующий трек после завершения текущего
    if (this.isPlaying) {
      this.nextTrack();
    }
  }

  // трек загружен и готов к воспроизведению
  handleLoaded() {
    // сброс флага загрузки
    this.isLoading = false;
    this.updatePlayButton();

    // обновление длительности в UI
    document.getElementById("mainTimer").textContent =
      this.secondsToMinutes(this.audio.duration);

    // автозапуск только если явно запрошено (не при переключении)
    if (this.shouldAutoPlay) {
      this.audio.play().catch((e) => this.handleError(e));
      this.shouldAutoPlay = false;
    }
  }

  // ошибка
  handleError(error) {
    console.error("Audio error:", error);
    this.isPlaying = false;
    this.updatePlayButton();
  }

  // смена UI кнопок запуск и пауза плеера
  updatePlayButton() {
    const playBtn = document.getElementById("mainPlay");
    if (!playBtn) return;

    if (this.isLoading) {
      playBtn.classList.add("loading");
      playBtn.disabled = true;
    } else {
      playBtn.classList.remove("loading");
      playBtn.disabled = false;
      playBtn.classList.toggle("play", !this.isPlaying);
      playBtn.classList.toggle("pause", this.isPlaying);
    }
  }

  // helper (форматирование длительности трека)
  secondsToMinutes(seconds) {
    if (isNaN(seconds)) return "00:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
}

export async function initPlayer(tracks) {
  const state = new PlayerState(tracks);

  // инициализация компонента
  renderTrackList(state);
  setupProgressBar(state);
  setupPlayerControls(state);

  // инициализация загрузки файлов
  setupDropzone(state);
  setupFileInput(state);

  // загрузка первого трека
  await state.loadTrack(state);

  return state;
}

function setupPlayerControls(state) {
  // обработчик на кнопку запуска/паузы плеера
  document
    .getElementById("mainPlay")
    .addEventListener("click", async () => {
      if (state.isPlaying) {
        state.pause();
      } else {
        await state.play();
      }
    });

  // обработчик на кнопку переключения на предыдущий трек
  document
    .getElementById("prev")
    .addEventListener("click", async () => {
      await state.prevTrack();
    });

  // обработчик на кнопку переключения на следующий трек трек
  document
    .getElementById("next")
    .addEventListener("click", async () => {
      await state.nextTrack();
    });
}
