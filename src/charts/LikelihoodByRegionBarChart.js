import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LikelihoodByRegionBarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Detect theme
    const isDark = document.documentElement.classList.contains("dark");
    const barColor = isDark ? "#fbbf24" : "#d97706";        // amber
    const hoverColor = isDark ? "#fcd34d" : "#f59e0b";      // lighter amber
    const axisColor = isDark ? "#e2e8f0" : "#111";

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 60, left: 50 };
    const width = 400;
    const height = 250;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const grouped = d3.rollups(
      data.filter(d => d.region && d.likelihood != null),
      v => d3.mean(v, d => d.likelihood),
      d => d.region
    );

    const x = d3.scaleBand()
      .domain(grouped.map(d => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(grouped, d => d[1]) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const g = svg.append('g');

    const tooltip = d3.select(svgRef.current.parentNode)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // BARS
    g.selectAll('rect')
      .data(grouped)
      .enter()
      .append('rect')
      .attr('x', d => x(d[0]))
      .attr('y', d => y(d[1]))
      .attr('width', x.bandwidth())
      .attr('height', d => y(0) - y(d[1]))
      .attr('fill', barColor)
      .on('mousemove', (event, d) => {
        d3.select(event.target).attr("fill", hoverColor);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d[0]}</strong>: ${d[1].toFixed(2)}`)
          .style('left', event.offsetX + 10 + 'px')
          .style('top', event.offsetY + 10 + 'px');
      })
      .on('mouseout', event => {
        d3.select(event.target).attr("fill", barColor);
        tooltip.style('opacity', 0);
      });

    // X AXIS
    g.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .call(g => g.selectAll("text").style("fill", axisColor))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Y AXIS
    g.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.selectAll("text").style("fill", axisColor));

  }, [data]);

  return <svg ref={svgRef} className="chart-svg" />;
};

export default LikelihoodByRegionBarChart;
