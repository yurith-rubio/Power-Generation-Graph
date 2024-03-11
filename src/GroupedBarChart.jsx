import React, { useEffect, useRef } from "react";
import { select, axisBottom, scaleLinear, scaleBand, axisLeft, scaleOrdinal} from "d3";
import * as d3 from 'd3';
import useResizeObserver from "./useResizeObserver";
import d3Tip from "d3-tip";

export default function GroupedBarChart({data, keys}) {
        
    const svgRef = useRef();
    const dimensions = useResizeObserver(svgRef);

    // Creating a new data structure for the grouped bar chart
    const renewableData = d3.reduce(data, function (acc, next) {
        const date = new Date(next["date_id"]);
        if (date.getFullYear() === 2022) {
            if (date.getMonth() === 9) {
                acc[0]["sum_renewable"] += next["sum_renewable"];
                acc[0]["sum_non_renewable"] += next["sum_non_renewable"];        
            } else if (date.getMonth() == 11) {
                acc[1]["sum_renewable"] += next["sum_renewable"];
                acc[1]["sum_non_renewable"] += next["sum_non_renewable"];        
            }
        }

        return acc;
    }, [
        {
            "month": "october",
            "sum_renewable": 0,
            "sum_non_renewable": 0
        },
        {
            "month": "december",
            "sum_renewable": 0,
            "sum_non_renewable": 0
        }
    ]);

    useEffect(() => {
        const svg = select(svgRef.current);
        const { width, height } = dimensions || svgRef.current.getBoundingClientRect();
        
        // keys
        const keys = ["sum_renewable", "sum_non_renewable"];
    
        // scales
        const xScale0 = scaleBand()
            .rangeRound([0, width])
            .padding(0.3);
        
        const xScale1 = scaleBand()
            .padding(0.3);
    
        const yScale = scaleLinear().domain([0, 30000]).range([height, 0]);
    
        // axes
        const xAxis = axisBottom(xScale0);
        const yAxis = axisLeft(yScale);
    
        xScale0.domain(renewableData.map(d => d.month));

        //array of quarterly value names, fitted in the available bottom categories (x0.bandwidth())
        xScale1.domain(keys).rangeRound([0, xScale0.bandwidth()])
        
        svg.select(".x-axis").style("transform", `translateY(${height}px)`).style("color", "003e6b").call(xAxis);
        svg.select(".y-axis").style("color", "003e6b").call(yAxis);

        // colors
        const colors = scaleOrdinal()
            .range(["#0d9949", "#0a2140"]);
    
        // adding a tooltip
        const tooltip = d3Tip()
            .attr('class', 'tool-tip')
            .html((d, i) => {
                return `<div class="tool-tip-text">${(d.target.__data__.value / 1000).toFixed(0)} GW</div>`
            })

        svg.call(tooltip)

        // rendering
        svg
            .selectAll(".bars")
            .data(renewableData)
            .join("g")
            .attr("transform", d => "translate(" + xScale0(d.month) + ",0)" )
            .classed("bars", true)
            .selectAll("rect")
            .data(d => { return keys.map(key => { return { key: key, value: d[key] }})})
            .join("rect")
            .attr("x", d => xScale1(d.key) )
            .attr("class", d => d.key)
            .attr("y", d => {
                return yScale(d.value / 1000 )
            })
            .attr("height", d => {
                console.log(d)
                return height - yScale(d.value / 1000)
            })
            .attr("width", xScale1.bandwidth())
            .attr("fill", d => colors(d.key))
            .on("mouseover", tooltip.show)
            .on("mouseleave", tooltip.hide)
        
    }, [renewableData])
    
    return (
        <React.Fragment>
            <section id="GroupedBarChart">
                <h2>Renewable VS Non-Renewable Power</h2>
                <svg ref={svgRef}>
                    <g className="x-axis" />
                    <g className="y-axis" />
                </svg>
                <div className="power-labels">
                    <div className="label-wrapper"><span className="power-label label-renewable"></span>Renewable Power</div>
                    <div className="label-wrapper"><span className="power-label label-no-renewable"></span>Not Renewable Power</div>
                </div>
            </section>
        </React.Fragment>
    );
}