import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RelevanceByYearLineChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Detect theme
    const isDark = document.documentElement.classList.contains("dark");
    const lineColor = isDark ? "#60a5fa" : "#1e40af";       // Blue line
    const dotColor = isDark ? "#93c5fd" : "#1d4ed8";        // Circle color
    const axisColor = isDark ? "#e2e8f0" : "#111";          // Axes text

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 400;
    const height = 250;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const grouped = d3.rollups(
  data
    .map(d => {
      const year =
        Number(d.year) ||
        Number(d.start_year) ||
        Number(d.end_year);

      return {
        year,
        relevance: d.relevance
      };
    })
    .filter(d => d.year > 0 && d.relevance != null),
  v => d3.mean(v, d => d.relevance),
  d => d.year
).sort((a, b) => a[0] - b[0]);

    const x = d3.scaleLinear()
      .domain(d3.extent(grouped, d => d[0]))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(grouped, d => d[1]) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const g = svg.append('g');

    const line = d3.line()
      .x(d => x(d[0]))
      .y(d => y(d[1]));

    g.append('path')
      .datum(grouped)
      .attr('fill', 'none')
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('d', line);

    const tooltip = d3.select(svgRef.current.parentNode)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    g.selectAll('circle')
      .data(grouped)
      .enter()
      .append('circle')
      .attr('cx', d => x(d[0]))
      .attr('cy', d => y(d[1]))
      .attr('r', 4)
      .attr('fill', dotColor)
      .on('mousemove', (event, d) => {
        tooltip
          .style('opacity', 1)
          .html(`${d[0]}: ${d[1].toFixed(2)}`)
          .style('left', event.offsetX + 10 + 'px')
          .style('top', event.offsetY + 10 + 'px');
      })
      .on('mouseout', () => tooltip.style('opacity', 0));

    g.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('d')))
      .call(g => g.selectAll("text").style("fill", axisColor));

    g.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.selectAll("text").style("fill", axisColor));

  }, [data]);

  return <svg ref={svgRef} className="chart-svg" />;
};

export default RelevanceByYearLineChart;
