function renderScene3(g, data) {
    const tooltip = d3.select("#tooltip");
  const completedData = data.filter(isCompletedTournament);
  
    const x = d3.scaleLinear()
      .domain([1928, 2028])
      .range([0, SVG.innerWidth]);
  
    const y = d3.scaleLinear()
      .domain([1.5, 6])
      .range([SVG.innerHeight, 0]);
  
    const r = d3.scaleSqrt()
      .domain([0, d3.max(completedData, d => d.Teams)])
      .range([4, 18]);
  
    g.append("g").attr("class", "grid")
      .call(d3.axisLeft(y).ticks(6).tickSize(-SVG.innerWidth).tickFormat(""));
    g.append("g").attr("class", "grid")
      .call(d3.axisBottom(x).ticks(11).tickSize(SVG.innerHeight).tickFormat(""))
      .attr("transform","translate(0,0)");
  
    const avgGoals = d3.mean(completedData, d => d.AvgGoalsPerGame);
    g.append("line")
      .attr("x1", 0).attr("x2", SVG.innerWidth)
      .attr("y1", y(avgGoals)).attr("y2", y(avgGoals))
      .attr("stroke", "#d4a017").attr("stroke-dasharray","6,4")
      .attr("stroke-width", 1).attr("opacity", 0.5);
  
    g.append("text").attr("fill","#d4a017").attr("font-size","11px")
      .attr("x", SVG.innerWidth - 4).attr("y", y(avgGoals) - 6)
      .attr("text-anchor","end")
      .text(`Historical avg: ${avgGoals.toFixed(2)}`);
  
    function drawDots(filteredData) {
      const dots = g.selectAll(".dot").data(filteredData, d => d.Year);
  
      dots.join(
        enter => enter.append("circle")
          .attr("class", "dot")
          .attr("cx", d => x(d.Year))
          .attr("cy", SVG.innerHeight)
          .attr("r", d => r(d.Teams))
          .attr("fill", d => getCountryColor(d.Winner))
          .attr("stroke", "#fff").attr("stroke-width", 1)
          .attr("opacity", 0)
          .on("pointerenter", function(event, d) {
            d3.select(this).attr("stroke", "#d4a017");
            tooltip.style("opacity", 1)
              .html(
                `<strong>${d.Year}</strong><br/>` +
                `🏟️ Host: ${d.Host}<br/>` +
                `🏆 ${d.Winner}<br/>` +
                `⚽ Goals: ${d.GoalsScored} in ${d.Matches} games<br/>` +
                `📊 Avg/Game: ${d.AvgGoalsPerGame}<br/>` +
                `👥 Teams: ${d.Teams}`
              )
              .style("left", (event.offsetX + 12) + "px")
              .style("top",  (event.offsetY - 28) + "px");
            setAnnotationText(
              `<strong>${d.Year} ${d.Host}</strong> — 🏆 ${d.Winner} defeated ${d.RunnerUp} in the final. ` +
              `${d.GoalsScored} goals in ${d.Matches} matches (avg ${d.AvgGoalsPerGame}/game), ` +
              `${d.Teams} teams participated.`
            );
          })
          .on("pointermove", function(event) {
            tooltip.style("left", (event.offsetX + 12) + "px")
                   .style("top",  (event.offsetY - 28) + "px");
          })
          .on("pointerleave", function() {
            d3.select(this).attr("stroke", "#fff");
            tooltip.style("opacity", 0);
            setAnnotationText(
              "Hover over any bubble to explore that tournament's details. " +
              "Bubble <strong>size</strong> encodes number of participating teams."
            );
          })
          .call(e => e.transition().duration(600)
            .attr("cy", d => y(d.AvgGoalsPerGame))
            .attr("opacity", 0.85)),
  
        update => update.transition().duration(500)
          .attr("cx", d => x(d.Year))
          .attr("cy", d => y(d.AvgGoalsPerGame))
          .attr("r", d => r(d.Teams))
          .attr("opacity", 0.85),
  
        exit => exit.transition().duration(400)
          .attr("opacity", 0).remove()
      );
    }
  
    drawDots(completedData);
      g.node().__drawDots = drawDots;

      function drawYearHostLabels(filteredData) {
        const labels = g.selectAll(".year-host-label")
          .data(filteredData, d => d.Year);

        const enter = labels.enter()
          .append("g")
          .attr("class", "year-host-label")
          .attr("transform", d => `translate(${x(d.Year)}, ${y(d.AvgGoalsPerGame) - r(d.Teams) - 6})`)
          .attr("opacity", 0);

        enter.append("text")
          .attr("class", "year-label")
          .attr("text-anchor", "middle")
          .attr("fill", "#a0b4cc")
          .attr("font-size", "10px")
          .text(d => d.Year);

        enter.append("text")
          .attr("class", "host-label")
          .attr("text-anchor", "middle")
          .attr("fill", "#8fb0d0")
          .attr("font-size", "8px")
          .attr("dy", 11)
          .text(d => d.Host);

        enter.transition().duration(450).attr("opacity", 1);

        labels
          .transition().duration(450)
          .attr("transform", d => `translate(${x(d.Year)}, ${y(d.AvgGoalsPerGame) - r(d.Teams) - 6})`)
          .attr("opacity", 1);

        labels.select(".year-label").text(d => d.Year);
        labels.select(".host-label").text(d => d.Host);

        labels.exit()
          .transition().duration(250)
          .attr("opacity", 0)
          .remove();
      }

      drawYearHostLabels(completedData);
      g.node().__drawYearHostLabels = drawYearHostLabels;
  
    g.append("g").attr("class","axis")
      .attr("transform",`translate(0,${SVG.innerHeight})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(11));
  
    g.append("g").attr("class","axis")
      .call(d3.axisLeft(y));
  
    g.append("text").attr("fill","#a0b4cc").attr("font-size","12px")
      .attr("text-anchor","middle")
      .attr("x", SVG.innerWidth / 2).attr("y", SVG.innerHeight + 48)
      .text("World Cup Year");
  
    g.append("text").attr("fill","#a0b4cc").attr("font-size","12px")
      .attr("text-anchor","middle")
      .attr("transform","rotate(-90)")
      .attr("x", -SVG.innerHeight / 2).attr("y", -52)
      .text("Average Goals Per Game");
  
    const legendData = Object.entries(countryColors);
    const legend = g.append("g").attr("transform",`translate(${SVG.innerWidth - 130}, 0)`);
    legend.append("rect").attr("width",128).attr("height", legendData.length * 20 + 10)
      .attr("fill","rgba(10,22,40,0.7)").attr("rx",4);
    legendData.forEach(([country, color], i) => {
      legend.append("circle").attr("cx",12).attr("cy", i*20+16).attr("r",6).attr("fill",color);
      legend.append("text").attr("x",24).attr("y",i*20+20).attr("fill","#d0e4f7").attr("font-size","11px").text(country);
    });
  
    setAnnotationText(
      "Bubble <strong>size</strong> encodes number of participating teams in completed editions. " +
      "<strong>Color</strong> shows the winning nation. " +
      "Use the decade filter above to focus on a specific era, including the expanded 2026 tournament."
    );
  }
  
  function applyDecadeFilter(decade) {
    state.selectedDecade = decade;
    const svg = d3.select("#main-svg");
    const g = svg.select(".chart-group");
  
    let filtered;
    if (decade === "All") {
      filtered = state.completedData;
    } else {
      const decadeStart = parseInt(decade);
      filtered = state.completedData.filter(d => d.Year >= decadeStart && d.Year < decadeStart + 10);
    }
  
    state.filteredData = filtered;
  
    const drawDots = g.node().__drawDots;
    if (drawDots) drawDots(filtered);

    const drawYearHostLabels = g.node().__drawYearHostLabels;
    if (drawYearHostLabels) drawYearHostLabels(filtered);
  
    d3.selectAll(".filter-btn").classed("active", false);
    d3.selectAll(".filter-btn").filter(function() {
      return this.dataset.decade === decade;
    }).classed("active", true);
  }
