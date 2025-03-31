import { renderTrackList } from "./TrackList";

// настройка дропзоны
export function setupDropzone(state) {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");

  // обработчики для drag-and-drop
  ["dragenter", "dragover", "dragleave", "drop"].forEach(
    (eventName) => {
      dropzone.addEventListener(
        eventName,
        preventDefaults,
        false,
      );
    },
  );

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // добавляем стили при использовании дропзоны
  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(
      eventName,
      unhighlight,
      false,
    );
  });

  function highlight() {
    dropzone.classList.add("active");
  }

  function unhighlight() {
    dropzone.classList.remove("active");
  }

  // Обработка сброса файлов
  dropzone.addEventListener("drop", handleDrop, false);
  dropzone.addEventListener("click", () =>
    fileInput.click(),
  );

  // чтение списка добавленных файлов в дропзоне
  async function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    await handleFiles(files, state);
  }
}

// установка слушателя на инпут выбора файлов (получение аудиофайлов и добавление в массив)
export function setupFileInput(state) {
  const fileInput = document.getElementById("fileInput");
  const dropzone = document.getElementById("dropzone");

  // Обработчик для label (предотвращение всплытия)
  const label = dropzone.querySelector(".fileInput-label");
  label.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  fileInput.addEventListener("change", async (e) => {
    if (fileInput.files.length) {
      // если файлы выбраны, добавяем их в массив треков
      try {
        await handleFiles(fileInput.files, state);

        // Сбрасываем значение input после обработки
        fileInput.value = "";
      } catch (error) {
        console.error("Ошибка загрузки файлов:", error);
        alert("Ошибка! не удалось загрузить файлы");
      }
    }
  });
}

// добавляем аудиофайлы в массив с треками
async function handleFiles(files, state) {
  try {
    const audioFiles = Array.from(files).filter((file) =>
      file.type.startsWith("audio/"),
    );

    // ограничение на количество загружаемых файлов
    if (audioFiles.length > 10) {
      alert("Можно загрузить не более 10 файлов за раз");
      return;
    }

    // Добавляем последовательно новые треки к текущему плейлисту
    for (const file of audioFiles) {
      const track = {
        name: file.name.replace(/\.[^/.]+$/, ""), // Удаляем расширение
        artist_name: "Локальный файл",
        audio: URL.createObjectURL(file),
        duration: await getAudioDuration(file),
      };

      state.tracks.push(track);
    }
  } catch (error) {}

  // Если были успешно обработаны файлы, обновляем плейлист и воспроизводим первый трек
  if (state.tracks.length > 0) {
    renderTrackList(state);
    state.currentIndex = 0;
    state.loadTrack();
  } else {
    alert("Не удалось загрузить ни одного аудиофайла");
  }
}

// установка длительности загруженных аудиофайлов
function getAudioDuration(file) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);

    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
      URL.revokeObjectURL(audio.src);
    });

    audio.addEventListener("error", () => {
      resolve(0); // Если не удалось получить длительность
      URL.revokeObjectURL(audio.src);
    });
  });
}
