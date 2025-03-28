// переводим секунды в минуты и секунды (длительность трека)
export function secondsToMinutes(seconds) {
  if (!seconds) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}
