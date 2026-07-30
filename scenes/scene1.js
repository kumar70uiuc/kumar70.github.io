function renderScene1(g, data) {
    const winsMap = {};
    const winsYearsMap = {};
    data.forEach(d => {
      winsMap[d.Winner] = (winsMap[d.Winner] || 0) + 1;
      if (!winsYearsMap[d.Winner]) winsYearsMap[d.Winner] = [];
      winsYearsMap[d.Winner].push(d.Year);
    });

    Object.keys(winsYearsMap).forEach((country) => {
      winsYearsMap[country] = [...new Set(winsYearsMap[country])].sort((a, b) => a - b);
    });
  
    const winsData = Object.entries(winsMap)
      .map(([country, wins]) => ({ country, wins }))
      .sort((a, b) => b.wins - a.wins);
  
    const x = d3.scaleLinear()
      .domain([0, d3.max(winsData, d => d.wins) + 0.5])
      .range([0, SVG.innerWidth]);
  
    const y = d3.scaleBand()
      .domain(winsData.map(d => d.country))
      .range([0, SVG.innerHeight])
      .padding(0.25);
  
    g.append("g").attr("class", "grid")
      .call(d3.axisBottom(x).ticks(6).tickSize(SVG.innerHeight).tickFormat(""))
      .attr("transform", "translate(0,0)");
  
    const tooltip = d3.select("#tooltip");
  
    g.selectAll(".bar")
      .data(winsData)
      .join("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", d => y(d.country))
      .attr("height", y.bandwidth())
      .attr("width", 0)
      .attr("rx", 4)
      .attr("fill", d => getCountryColor(d.country))
      .on("mouseover", function(event, d) {
        const winningYears = winsYearsMap[d.country] || [];
        tooltip.style("opacity", 1)
          .html(
            `<strong>${d.country}</strong><br/>` +
            `📅 Winning years: ${winningYears.join(", ")}`
          )
          .style("left", (event.offsetX + 12) + "px")
          .style("top",  (event.offsetY - 28) + "px");
      })
      .on("mousemove", function(event) {
        tooltip.style("left", (event.offsetX + 12) + "px")
               .style("top",  (event.offsetY - 28) + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0))
      .transition().duration(800).delay((d, i) => i * 80)
      .attr("width", d => x(d.wins));
  
    g.selectAll(".bar-label")
      .data(winsData)
      .join("text")
      .attr("class", "bar-label")
      .attr("x", d => x(d.wins) + 6)
      .attr("y", d => y(d.country) + y.bandwidth() / 2 + 4)
      .attr("fill", "#d4a017")
      .attr("font-size", "13px")
      .attr("font-weight", "bold")
      .attr("opacity", 0)
      .text(d => d.wins)
      .transition().delay(900).duration(400)
      .attr("opacity", 1);
  
    g.append("g").attr("class", "axis")
      .attr("transform", `translate(0,${SVG.innerHeight})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.format("d")));
  
    g.append("g").attr("class", "axis")
      .call(d3.axisLeft(y));
  
    g.append("text").attr("fill","#a0b4cc").attr("font-size","12px")
      .attr("text-anchor","middle")
      .attr("x", SVG.innerWidth / 2).attr("y", SVG.innerHeight + 48)
      .text("Number of World Cup Titles");
    
    const brazilWins = winsData.find(d => d.country === "Brazil");
        if (brazilWins) {
          drawAnnotation(g, {
            x: x(brazilWins.wins),
            y: y(brazilWins.country) + y.bandwidth() / 2,
            dx: -155,
            dy: -30,
            title: "Brazil",
            label: "With 5 titles, Brazil has dominated the World Cup."
          });
        }
    
    setAnnotationText(
      "<strong>Brazil leads all nations with 5 World Cup titles.</strong> " +
      "A small group of countries — Brazil, Germany, Italy, and Argentina — " +
      "account for <em>most</em> of the 24 completed tournaments through 2026. " +
      "Hover over any bar for details."
    );
  }
