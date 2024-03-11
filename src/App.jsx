import React, { useEffect, useState } from "react";
import "./App.css";
import StackedAreaChart from "./StackedAreaChart";
import dataSource from './data_reshaped.json';
import GroupedBarChart from "./GroupedBarChart";

// Getting all the keys from the data
const keysArray = dataSource.map(key => {
  const name = Object.keys(key) 
  return name;
})

// keys for the area chart
const allKeys = keysArray[0].filter(d => { 
  return d != "date_id" && d != "sum_renewable" && d != "sum_non_renewable"
})

// keys for the bar chart
const allRenewableKeys = keysArray[0].filter(d => { 
  return d === "sum_renewable" || d === "sum_non_renewable"
})

// colors for area chart
const colors = {
  "Biomass": "#21678d",
  "Dam Hydro": "#2981aa",
  "Geothermal": "#84e1f1",
  "Hard Coal": "#246d5e",
  "Lignite": "#A0F1F2",
  "Natural Gas": "#76D1E5",
  "Non-renewable waste": "#79BDB3",
  "Nuclear": "#324042",
  "Oil": "#5e6f72",
  "Other fossil fuel": "#4b6364",
  "Other renewables": "#FFA4A4",
  "Pumped storage generation": "#FFE5A4",
  "Run-of-River Hydro": "#F2FFA4",
  "Solar": "#f0d90d",
  "Wind offshore": "#49853e",
  "Wind onshore": "#30866c"
};


function App() {
  const [keys, setKeys] = useState(allKeys);

  return (
    <React.Fragment>
      <section id="StackedAreaChart">
      <h2>Power Generation Graph</h2>
      <StackedAreaChart data={dataSource} keys={keys} colors={colors} />
        <div className="fields">
          {allKeys.map(key => (
            <div key={key} className="field">
              <input
                id={key}
                type="checkbox"
                checked={keys.includes(key)}
                onChange={e => {
                  if (e.target.checked) {
                    setKeys(Array.from(new Set([...keys, key])));
                  } else {
                    setKeys(keys.filter(_key => _key !== key));
                  }
                }}
              />
              <div className="color-label" style={{backgroundColor: `${colors[key]}`}}></div>
              <label htmlFor={key} className="checkbox-label">
                {key}
              </label>
            </div>
          ))}
        </div>
      </section>
      <GroupedBarChart data={dataSource} keys={allRenewableKeys} />


    </React.Fragment>
  );
}

export default App;