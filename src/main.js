import { initPlayer } from "./scripts/components/Player.js";
import { fetchTracks } from "./scripts/utils/api";

document.addEventListener("DOMContentLoaded", async () => {
  const tracks = await fetchTracks();
  initPlayer(tracks);
});

// // Анимация
// const containerAnimation =
//   document.querySelector(".marquee");
// const textAnimation =
//   document.querySelectorAll(".marquee span");

// function runningLine() {
//   textAnimation.forEach((item) => {
//     if (
//       item.offsetWidth >= containerAnimation.offsetWidth
//     ) {
//       item.classList.add("running-line");
//     } else {
//       item.classList.remove("running-line");
//     }
//   });
// }
// const barProgress = document.getElementById("bar");
// let width = 0;

// Dropzone
// const dropzone = document.querySelector("#dropzone");
// dropzone.addEventListener("click", chooseFile);

// function chooseFile() {
//   const input = document.createElement("input");
//   input.setAttribute("accept", "audio/mp3");
//   input.type = "file";

//   input.onchange = function (e) {
//     const file = e.target.files[0];

//     // название песни
//     let nameSong = file.name
//       .split(".")
//       .slice(0, -1)
//       .join()
//       .replace(/[_]+/g, " ")
//       .split("-");

//     // ссылка на песню
//     let urlSong = URL.createObjectURL(file);

//     const audiocont = document.createElement("audio");
//     audiocont.setAttribute("src", `${urlSong}`);

//     audiocont.addEventListener(
//       "loadedmetadata",
//       function getDuration() {
//         // длительность песни
//         let seconds = audiocont.duration;
//         let durationSong = `${
//           Math.floor(seconds / 60) < 10
//             ? `0${Math.floor(seconds / 60)}`
//             : Math.floor(seconds / 60)
//         }:${
//           Math.ceil(seconds % 60) < 10
//             ? `0${Math.ceil(seconds % 60)}`
//             : Math.ceil(seconds % 60)
//         }`;

//         //создание экземпляра песни, добавление в массив, вывод в треклист и проигрыватель
//         let newSong = new AddAudio({
//           name: nameSong,
//           file: urlSong,
//           duration: durationSong,
//         });

//         tracks.push(newSong);
//         createTrackItem(
//           tracks.length - 1,
//           newSong.name,
//           newSong.duration,
//         );

//         const playListItems = document.querySelectorAll(
//           ".tracklist__trackContainer",
//         );
//         playListItems[
//           playListItems.length - 1
//         ].addEventListener(
//           "click",
//           getClickedElement.bind(this),
//         );

//         loadNewTrack(tracks.length - 1);
//       },
//     );
//   };
//   input.click();
// }

// class AddAudio {
//   constructor(options) {
//     (this.id = options.id),
//       (this.name = options.name),
//       (this.file = options.file),
//       (this.duration = options.duration);
//   }
// }

// window.onload = () => {
//   if (typeof window.FileReader == undefined) {
//     dropzone.textContent = "Не поддерживается браузером";
//     dropzone.classList.add("error");
//   } else {
//     dropzone.innerHTML = `<button>Выберите</button>
//     <p>песню для загрузки</p>`;
//   }
// };
