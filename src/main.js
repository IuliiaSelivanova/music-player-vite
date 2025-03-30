import { initPlayer } from "./scripts/components/Player.js";
import { fetchTracks } from "./scripts/utils/api";

document.addEventListener("DOMContentLoaded", async () => {
  const tracks = await fetchTracks();
  initPlayer(tracks);
});
