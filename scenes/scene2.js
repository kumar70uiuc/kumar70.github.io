function renderScene2(g, data) {
    const tooltip = d3.select("#tooltip");
    const sceneData = data
      .filter(d => d.Year <= 2026)
      .sort((a, b) => a.Year - b.Year);

    const clipId = "scene2-plot-clip";
    g.append("clipPath")
      .attr("id", clipId)
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", SVG.innerWidth)
      .attr("height", SVG.innerHeight);
  
    const x = d3.scaleLinear()
      .domain([1930, 2026])
      .range([0, SVG.innerWidth])
      .clamp(true);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(sceneData, d => d.GoalsScored) + 10])
      .range([SVG.innerHeight, 0]);
  
    g.append("g").attr("class", "grid")
      .call(d3.axisLeft(y).ticks(6).tickSize(-SVG.innerWidth).tickFormat(""));
  
    const line = d3.line()
      .x(d => x(d.Year))
      .y(d => y(d.GoalsScored))
      .curve(d3.curveMonotoneX);
  
    const path = g.append("path")
      .datum(sceneData)
      .attr("fill", "none")
      .attr("stroke", "#d4a017")
      .attr("stroke-width", 2.5)
      .attr("clip-path", `url(#${clipId})`)
      .attr("d", line);
  
    const totalLength = path.node().getTotalLength();
    path.attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition().duration(1500).ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
  
    const area = d3.area()
      .x(d => x(d.Year))
      .y0(SVG.innerHeight)
      .y1(d => y(d.GoalsScored))
      .curve(d3.curveMonotoneX);
  
    g.append("path")
      .datum(sceneData)
      .attr("fill", "rgba(212,160,23,0.08)")
      .attr("clip-path", `url(#${clipId})`)
      .attr("d", area);
  
    g.selectAll(".dot")
      .data(sceneData)
      .join("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.Year))
      .attr("cy", d => y(d.GoalsScored))
      .attr("r", 6)
      .attr("fill", d => getCountryColor(d.Winner))
      .attr("stroke", "#d4a017")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 9);
        tooltip.style("opacity", 1)
          .html(
            `<strong>${d.Year}</strong><br/>` +
            `🏟️ Host: ${d.Host}<br/>` +
            `🏆 Winner: ${d.Winner}<br/>` +
            `⚽ Goals: ${d.GoalsScored}<br/>` +
            `📊 Avg/Game: ${d.AvgGoalsPerGame}`
          )
          .style("left", (event.offsetX + 12) + "px")
          .style("top",  (event.offsetY - 28) + "px");
      })
      .on("mousemove", function(event) {
        tooltip.style("left", (event.offsetX + 12) + "px")
               .style("top",  (event.offsetY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 6);
        tooltip.style("opacity", 0);
      })
      .transition().delay(1500).duration(400)
      .attr("opacity", 1);
  
    g.append("g").attr("class", "axis")
      .attr("transform", `translate(0,${SVG.innerHeight})`)
      .call(d3.axisBottom(x)
        .tickValues([...d3.range(1930, 2030, 10), 2026])
        .tickFormat(d3.format("d")));
  
    g.append("g").attr("class", "axis")
      .call(d3.axisLeft(y));
  
    g.append("text").attr("fill","#a0b4cc").attr("font-size","12px")
      .attr("text-anchor","middle")
      .attr("x", SVG.innerWidth / 2).attr("y", SVG.innerHeight + 48)
      .text("World Cup Year");
  
    g.append("text").attr("fill","#a0b4cc").attr("font-size","12px")
      .attr("text-anchor","middle")
      .attr("transform","rotate(-90)")
      .attr("x", -SVG.innerHeight / 2).attr("y", -52)
      .text("Total Goals Scored");
  
    const peakYear = sceneData.reduce((best, curr) => {
      if (curr.Year > 2026) return best;
      if (!best || curr.GoalsScored > best.GoalsScored) return curr;
      return best;
    }, null);
    setTimeout(() => {
      drawAnnotation(g, {
        x: x(peakYear.Year), y: y(peakYear.GoalsScored),
        dx: -140, dy: -25,
        title: `${peakYear.Year}`,
        label: `Host: ${peakYear.Host}. ${peakYear.GoalsScored} goals, the most in the last World Cup.`
      });
    }, 1800);
  
    setAnnotationText(
      "<strong>Scoring totals generally rise in modern editions as tournament scale increased.</strong> " +
      "Dots are colored by the winning nation. <strong>Hover over any dot</strong> for details."
    );
  }
