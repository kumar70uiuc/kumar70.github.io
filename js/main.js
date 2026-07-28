function prevScene() {
  if (state.currentScene > 1) {
    state.currentScene--;
    renderScene(state.currentScene);
  }
}

function nextScene() {
  if (state.currentScene < 3) {
    state.currentScene++;
    renderScene(state.currentScene);
  }
}

function renderScene(sceneNum) {
  document.getElementById("current-scene-num").textContent = sceneNum;
  document.getElementById("prev-btn").disabled = sceneNum === 1;
  document.getElementById("next-btn").disabled = sceneNum === 3;

  document.getElementById("filter-container").innerHTML = "";

  const sceneMeta = {
    1: {
      title: "Who Has Dominated the World Cup?",
      subtitle: "Total World Cup titles by country from 1930 to 2026"
    },
    2: {
      title: "How Has Scoring Changed Over Time?",
      subtitle: "Total goals scored at each completed tournament (1930 to 2026)"
    },
    3: {
      title: "Explore Every Tournament",
      subtitle: "Bubble size shows team count and color shows the winning nation"
    }
  };

  document.getElementById("scene-title").textContent = sceneMeta[sceneNum].title;
  document.getElementById("scene-subtitle").textContent = sceneMeta[sceneNum].subtitle;

  const svgEl = document.getElementById("main-svg");
  const svg = d3.select(svgEl);
  svg.selectAll("*").remove();
  svg.attr("viewBox", `0 0 ${SVG.width} ${SVG.height}`);

  const g = svg.append("g")
    .attr("class", "chart-group")
    .attr("transform", `translate(${SVG.margin.left},${SVG.margin.top})`);

  g.attr("opacity", 0).transition().duration(500).attr("opacity", 1);

  if (sceneNum === 1) {
    renderScene1(g, state.completedData);
  } else if (sceneNum === 2) {
    renderScene2(g, state.completedData);
  } else if (sceneNum === 3) {
    state.filteredData = state.completedData;
    renderScene3(g, state.data);
    buildDecadeFilters();
  }
}

function buildDecadeFilters() {
  const container = document.getElementById("filter-container");
  const label = document.createElement("span");
  label.style.cssText = "color:#a0b4cc;font-size:0.85rem;align-self:center;";
  label.textContent = "Filter by Decade: ";
  container.appendChild(label);

  decades.forEach((decade) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (decade === "All" ? " active" : "");
    btn.textContent = decade;
    btn.dataset.decade = decade === "All" ? "All" : decade.replace("s", "");
    btn.onclick = () => applyDecadeFilter(decade === "All" ? "All" : decade.replace("s", ""));
    container.appendChild(btn);
  });
}

function initApp() {
  d3.csv("data/fifa_worldcup.csv")
    .then((rawData) => {
      state.data = buildTournamentData(rawData);
      state.completedData = state.data.filter(isCompletedTournament);
      state.filteredData = state.completedData;
      renderScene(1);
    })
    .catch((err) => {
      console.error("Failed to load CSV:", err);
      document.getElementById("scene-title").textContent = "⚠️ Error loading data";
      document.getElementById("annotation-text").textContent =
        "Could not load fifa_worldcup.csv. Check the data folder.";
    });
}

document.addEventListener("DOMContentLoaded", initApp);