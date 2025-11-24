import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RegionBubbleChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Detect theme
    const isDark = document.documentElement.classList.contains("dark");
    const bubbleColor = isDark ? "#38bdf8" : "#0284c7";   // Main bubble
    const strokeColor = isDark ? "#e2e8f0" : "#111";       // Bubble outline
    const axisColor   = isDark ? "#cbd5e1" : "#111";       // Axis labels

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 60, left: 50 };
    const width = 400;
    const height = 250;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const grouped = d3.rollups(
      data.filter(d => d.region),
      v => ({
        count: v.length,
        avgIntensity: d3.mean(v, d => d.intensity || 0)
      }),
      d => d.region
    );

    const x = d3.scaleBand()
      .domain(grouped.map(d => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.5);

    const y = d3.scaleLinear()
      .domain([0, d3.max(grouped, d => d[1].avgIntensity) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const r = d3.scaleSqrt()
      .domain([0, d3.max(grouped, d => d[1].count) || 1])
      .range([4, 25]);

    const g = svg.append('g');

    const tooltip = d3.select(svgRef.current.parentNode)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Bubbles
    g.selectAll('circle')
      .data(grouped)
      .enter()
      .append('circle')
      .attr('cx', d => x(d[0]))
      .attr('cy', d => y(d[1].avgIntensity))
      .attr('r', d => r(d[1].count))
      .attr('fill', bubbleColor)
      .attr('stroke', strokeColor)
      .attr('stroke-width', 1.3)
      .on('mousemove', (event, d) => {
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d[0]}</strong><br/>
             Avg Intensity: ${d[1].avgIntensity.toFixed(2)}<br/>
             Count: ${d[1].count}`
          )
          .style('left', event.offsetX + 10 + 'px')
          .style('top', event.offsetY + 10 + 'px');
      })
      .on('mouseout', () => tooltip.style('opacity', 0));

    // X axis
    g.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .call(g => g.selectAll("text").style("fill", axisColor))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Y axis
    g.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.selectAll("text").style("fill", axisColor));

  }, [data]);

  return <svg ref={svgRef} className="chart-svg" />;
};

export default RegionBubbleChart;
