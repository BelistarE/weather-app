let units = "us";
function setUnitsToCelsius() {
  units = "metric";
  console.log("Units:" + units);
}
const toggleBtn = document.getElementById("toggle");

function toggle() {
  toggleBtn.addEventListener("change", function () {
    if (toggleBtn.checked) {
      setUnitsToCelsius();
    } else {
      units = "us";
      console.log("Units:" + units);
    }
  });
  return units;
}

export { toggle };
