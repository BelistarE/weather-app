import "./style.css";
import { init } from "./view";
import { callNew } from "./call-new";
import "./weather-icons.min.css";

init();

document.getElementById("searchInput").addEventListener("input", function () {
  const input = this.value;
  const button = document.getElementById("searchButton");

  if (input.length >= 3) {
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }
});

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

function handleSearch() {
  const query = searchInput.value;
  callNew(query);
}

searchButton.addEventListener("click", handleSearch);
