import React, { useEffect, useRef } from "react";
import { select, scalePoint, axisBottom, stack, max, scaleLinear, axisLeft, stackOrderAscending, area, curveBasis } from "d3";
import useResizeObserver from "./useResizeObserver";

function StackedAreaChart({ data, keys, colors }) {
  const svgRef = useRef();
  const dimensions = useResizeObserver(svgRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } = dimensions || svgRef.current.getBoundingClientRect();
    
    // stacks / layers - Setting the stack function for the chart, to overlap the layers
    const stackGenerator = stack()
      .keys(keys)
      .order(stackOrderAscending)
    const layers = stackGenerator(data);
    const extent = [0, max(layers, layer => max(layer, sequence => sequence[1])) / 1000];

    // scales
    const xScale = scalePoint()
      .domain(data.map(d => { 
        return d.date_id;
      }))
      .range([0, width])
        
    const yScale = scaleLinear()
      .domain(extent)
      .range([height, 0])
    
    const areaGenerator = area()
      .x(sequence => { 
        return xScale(sequence.data.date_id)
      } )
      .y0(sequence => {
          return yScale(sequence[0]) / 1000
        })
      .y1(sequence => yScale(sequence[1]) / 1000)
        .curve(curveBasis)

    // rendering
    svg.selectAll(".layer")
      .data(layers)
      .join("path")
      .attr("class", "layer")
      .attr("fill", layer => {
        return colors[layer.key]
      })
      .attr("d", areaGenerator)
      
    // axes
    const xAxis = axisBottom(xScale)
      .tickValues(xScale.domain().filter((d, i) => i % 300 === 0));
    
    svg
      .select(".x-axis")
      .style("transform", `translate(0px, ${height}px)`)
      .style("color", "003e6b")
      .call(xAxis);
    
    const yAxis = axisLeft(yScale);
      svg
        .select(".y-axis")
        .style("color", "003e6b")
        .call(yAxis);
    
  }, [colors, data, dimensions, keys]);

  return (
    <React.Fragment>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </React.Fragment>
  );
}

export default StackedAreaChart;