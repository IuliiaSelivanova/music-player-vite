export function setMarquee() {
  const songNode = document.getElementById("song");
  const marqueeWidth =
    document.querySelector(".marquee").clientWidth;
  const songNodeWidth =
    document.getElementById("song").offsetWidth;

  if (songNodeWidth > marqueeWidth) {
    songNode.classList.add("running-line");
  }
}
