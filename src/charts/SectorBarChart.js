import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TopicDistributionPieChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Detect theme
    const isDark = document.documentElement.classList.contains("dark");

    const colors = isDark
      ? ["#60a5fa","#34d399","#f87171","#fbbf24","#a78bfa",
         "#fb7185","#4ade80","#38bdf8","#f472b6","#facc15"]
      : d3.schemeTableau10;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 250;
    const radius = Math.min(width, height) / 2 - 10;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const grouped = d3.rollups(
      data.filter(d => d.topic),
      v => v.length,
      d => d.topic
    );

    const pie = d3.pie().value(d => d[1]);
    const arcs = pie(grouped);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);

    const colorScale = d3.scaleOrdinal()
      .domain(grouped.map(d => d[0]))
      .range(colors);

    // Tooltip
    const tooltip = d3
      .select(svgRef.current.parentNode)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // PIE SLICES
    g.selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => colorScale(d.data[0]))
      .attr("stroke", isDark ? "#e2e8f0" : "#fff")
      .attr("stroke-width", 1)
      .on("mousemove", (event, d) => {
        const topic = d.data[0];
        const count = d.data[1];

        tooltip
          .style("opacity", 1)
          .html(`<strong>${topic}</strong><br/>Count: ${count}`)
          .style("left", event.offsetX + 10 + "px")
          .style("top", event.offsetY + 10 + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0))
      .transition()
      .duration(500)
      .attrTween("d", function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return t => {
          d.endAngle = i(t);
          return arc(d);
        };
      });

    // TEXT LABELS
    g.selectAll("text")
      .data(arcs)
      .enter()
      .append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("font-size", "9px")
      .style("fill", isDark ? "#e2e8f0" : "#111")
      .text(d => d.data[0].length > 10 ? d.data[0].slice(0, 10) + "…" : d.data[0]);

  }, [data]);

  return <svg ref={svgRef} className="chart-svg" />;
};

export default TopicDistributionPieChart;
