function attachGlobalTriggers() {
  window.prevScene = prevScene;
  window.nextScene = nextScene;
  window.applyDecadeFilter = applyDecadeFilter;

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      nextScene();
    } else if (event.key === "ArrowLeft") {
      prevScene();
    }
  });
}

document.addEventListener("DOMContentLoaded", attachGlobalTriggers);