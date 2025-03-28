import axios from "axios";

export async function fetchTracks() {
  const URL =
    "https://api.jamendo.com/v3.0/tracks/?client_id=92a975eb&format=json&search=rock&limit=10";

  const res = await axios.get(URL);
  return res.data.results;
}
