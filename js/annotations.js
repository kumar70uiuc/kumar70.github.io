function drawAnnotation(g, config) {
  const annotations = [{
    note: { title: config.title, label: config.label, wrap: 180, padding: 6 },
    x: config.x,
    y: config.y,
    dx: config.dx || 60,
    dy: config.dy || -40,
    color: "#d4a017"
  }];

  const makeAnnotations = d3.annotation()
    .type(d3.annotationCalloutCurve)
    .annotations(annotations);

  g.append("g")
    .attr("class", "d3-annotation-group")
    .call(makeAnnotations);
}

function setAnnotationText(text) {
  document.getElementById("annotation-text").innerHTML = text;
}