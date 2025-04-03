import React, { useState } from "react";
import { Table, Pagination, Select } from "antd";
import Plot from "react-plotly.js";
// import RainEffect from "./RainEffect";

function Center({ selectedArea, selectedAreaName, areaData }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedColumn, setSelectedColumn] = useState("conductivity");
    const pageSize = 5;

    const requiredColumns = [
        "timestamp", "block", "chlorine", "fluoride", "conductivity", "ph", "totaldissolvedsolids", "turbidity", "watertemperature", "target"
    ];

    const standards = {
        ph: { min: 6.5, max: 8.5 },
        chlorine: { min: 0.2, max: 4.0 },
        fluoride: { min: 0.5, max: 1.5 },
        conductivity: { min: 50, max: 1500 },
        turbidity: { min: 1, max: 5 },
        totaldissolvedsolids: { min: 500, max: 1000 },
        watertemperature: { min: 77, max: 86 }
    };

    const filteredData = areaData.map(row =>
        Object.fromEntries(Object.entries(row).filter(([key]) => requiredColumns.includes(key)))
    );

    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const uniqueBlocks = [...new Set(areaData.map(row => row.block))];
// Step 1: Get all unique timestamps and sort them in ascending order
const uniqueTimestamps = [...new Set(areaData.map(row => new Date(row.timestamp).toISOString()))]
    .sort((a, b) => new Date(a) - new Date(b)); // Sorted common X-axis

// Linear interpolation function for missing values
const interpolate = (data, xValues, selectedColumn) => {
    const interpolatedY = [];
    for (let i = 0; i < xValues.length; i++) {
        const ts = xValues[i];
        const match = data.find(row => new Date(row.timestamp).toISOString() === ts);
        
        if (match) {
            interpolatedY.push(match[selectedColumn]);
        } else {
            // Find nearest known values
            const prev = data.filter(row => new Date(row.timestamp) < new Date(ts)).pop();
            const next = data.find(row => new Date(row.timestamp) > new Date(ts));
            
            if (prev && next) {
                // Perform linear interpolation
                const t1 = new Date(prev.timestamp).getTime();
                const t2 = new Date(next.timestamp).getTime();
                const v1 = prev[selectedColumn];
                const v2 = next[selectedColumn];
                const t = new Date(ts).getTime();
                
                // Interpolate value using weighted average
                const interpolatedValue = v1 + ((v2 - v1) * ((t - t1) / (t2 - t1)));
                interpolatedY.push(interpolatedValue);
            } else {
                // If no previous or next, use closest known value
                interpolatedY.push(prev ? prev[selectedColumn] : (next ? next[selectedColumn] : 0));
            }
        }
    }
    return interpolatedY;
};

// Step 2: Create line plot data for each block
const linePlotData = uniqueBlocks.map(block => {
    const blockData = areaData.filter(row => row.block === block);

    return {
        x: uniqueTimestamps, // Common x-axis for all blocks
        y: interpolate(blockData, uniqueTimestamps, selectedColumn), // Interpolated values
        mode: "lines",
        name: block
    };
});


const groupedBarChartData = uniqueBlocks.map(block => {
    const blockData = areaData.filter(row => row.block === block);

    return {
        x: uniqueTimestamps, // Common x-axis for all blocks
        y: interpolate(blockData, uniqueTimestamps, selectedColumn), // Interpolated values
        type: "bar",
        name: block
    };
});  

    

    // Adding standard min and max reference lines
    const standardLines = standards[selectedColumn] ? [
        {
            x: [areaData[0]?.timestamp, areaData[areaData.length - 1]?.timestamp],
            y: [standards[selectedColumn].min, standards[selectedColumn].min],
            mode: "lines",
            line: { color: "red", dash: "dash" },
            name: "Min Standard"
        },
        {
            x: [areaData[0]?.timestamp, areaData[areaData.length - 1]?.timestamp],
            y: [standards[selectedColumn].max, standards[selectedColumn].max],
            mode: "lines",
            line: { color: "green", dash: "dash" },
            name: "Max Standard"
        }
    ] : [];

    return (
        <div style={{ height: "85vh", overflowY: "auto", overflowX: "auto", width: "100%" }}>
            {selectedArea && areaData.length > 0 ? (
                <>
                    <h1 style={{ textAlign: "center" }}>{selectedAreaName} Water Quality Data</h1>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", borderBottom: "2px solid gray", paddingBottom: "20px" }}>
                        <div style={{ width: "48%" }}>
                            <h3 style={{ textAlign: "center" }}>Time Series Data</h3>
                            <Select
                                style={{ width: "100%", marginBottom: "10px" }}
                                value={selectedColumn}
                                onChange={(value) => setSelectedColumn(value)}
                            >
                                {requiredColumns.slice(2).map(col => (
                                    <Select.Option key={col} value={col}>{col.toUpperCase()}</Select.Option>
                                ))}
                            </Select>
                            <Plot
                                data={[...linePlotData, ...standardLines]}
                                layout={{ title: "Water Quality Trends", xaxis: { title: "Timestamp" }, yaxis: { title: selectedColumn } }}
                            />
                        </div>
                        <div style={{ width: "50%",  }}>
                            <h3 style={{ textAlign: "center" }}>Animated Time-Series Bubble Chart</h3>
                            <Plot
                                data={[...groupedBarChartData,...standardLines]}
                                layout={{
                                    barmode: "group",  // Groups bars for different blocks
                                    xaxis: {
                                        title: "Timestamp",
                                        tickangle: -90,
                                    },
                                    yaxis: {
                                        title: selectedColumn,
                                    },
                                    
                                }}
                            />
                        </div>
                    </div>

                    {/* Table Section */}
                    <div style={{ marginTop: "40px" }}>
                        <Table
                            dataSource={paginatedData}
                            columns={requiredColumns.map((key) => ({
                                title: key.toUpperCase(),
                                dataIndex: key,
                                key
                            }))}
                            pagination={false}
                            bordered
                        />
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={filteredData.length}
                            onChange={(page) => setCurrentPage(page)}
                            showSizeChanger={false}
                        />
                    </div>
                </>
            ) : selectedArea ? (
                <p>No data available for this area.</p>
            ) : (
                <div
                    style={{
                        textAlign: "center",
                        minHeight: "130vh",
                        width: "100%",
                        height: "100%",
                        color: "white",
                        padding: "30px",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
                    }}
                >
                    {/* <RainEffect></RainEffect> */}
                    <h1 style={{ padding: "0", margin: "0", fontSize: "2.5rem", fontWeight: "bold" }}>
                        Welcome to Water Quality Dashboard
                    </h1>
                    <h2 style={{ marginTop: "10px", fontSize: "1.8rem", fontStyle: "italic" }}>
                        "Is Your Water as Pure as It Should Be?"
                    </h2>

                    {/* Image below the tagline */}
                    <img
                        src="\background_imag.jpg"
                        alt="Water Purity"
                        style={{
                            width: "50%",
                            maxWidth: "500px",
                            marginTop: "15px",
                            borderRadius: "10px",
                            boxShadow: "2px 4px 6px rgba(0,0,0,0.3)"
                        }}
                    />

                    <p style={{ fontSize: "1.2rem", marginTop: "10px" }}>
                        Select an area from the sidebar to view detailed water quality information.
                    </p>



                    <div class="cards">
                        <div class="row">
                            <article class="card">
                                <img src="https://media.istockphoto.com/id/1470724451/vector/ph-scale-meter-for-acidic-and-alkaline-solutions-acid-base-balance-scale-chemical-test.jpg?s=612x612&w=0&k=20&c=dRlBWm1xfWTiJYCPlQOwO3wDMaiT2lblOCwKjsxLFaM=" alt="pH Levels" />
                                <div class="card-content">
                                    <header><h2>pH Level</h2></header>
                                    <p>- The pH scale measures acidity and alkalinity, ranging from 0 to 14, with 7 being neutral. </p>
                                    <br />
                                    <p>- Regulatory bodies like the World Health Organization (WHO) and the Environmental Protection Agency (EPA) recommend a pH range of 6.5 to 8.5 for drinking water.  </p>
                                </div>
                            </article>

                            <article class="card">
                                <img src="https://freeup.world/wp-content/uploads/2021/07/Trubidity-1.png" alt="Turbidity" />
                                <div class="card-content">
                                    <header><h2>Turbidity</h2></header>
                                    <p>Determines water clarity based on suspended solids.</p>
                                </div>
                            </article>

                            <article class="card">
                                <img src="https://source.unsplash.com/300x200/?oxygen" alt="Dissolved Oxygen" />
                                <div class="card-content">
                                    <header><h2>Dissolved Oxygen (DO)</h2></header>
                                    <p>Essential for aquatic life, influenced by pollution.</p>
                                </div>
                            </article>
                        </div>

                        <div class="row">
                            <article class="card">
                                <img src="https://source.unsplash.com/300x200/?conductivity" alt="Conductivity" />
                                <div class="card-content">
                                    <header><h2>Conductivity</h2></header>
                                    <p>Indicates dissolved salts and mineral content.</p>
                                </div>
                            </article>

                            <article class="card">
                                <img src="https://source.unsplash.com/300x200/?nitrate" alt="Nitrate" />
                                <div class="card-content">
                                    <header><h2>Nitrate</h2></header>
                                    <p>Reflects agricultural runoff and industrial waste.</p>
                                </div>
                            </article>

                            <article class="card">
                                <img src="https://source.unsplash.com/300x200/?hardness" alt="Water Hardness" />
                                <div class="card-content">
                                    <header><h2>Water Hardness</h2></header>
                                    <p>Defined by calcium & magnesium levels.</p>
                                </div>
                            </article>
                        </div>

                        <div class="row">
                            <article class="card">
                                <img src="https://source.unsplash.com/300x200/?bod" alt="Biochemical Oxygen Demand (BOD)" />
                                <div class="card-content">
                                    <header><h2>Biochemical Oxygen Demand (BOD)</h2></header>
                                    <p>Measures oxygen needed for organic matter breakdown.</p>
                                </div>
                            </article>
                        </div>
                    </div>



                    <div class="contributors-container">
                        <h3 class="contributors-heading">Contributors</h3>

                        <div class="contributors-list">

                            <div class="contributor-card">
                                <img src="background_imag.jpg" alt="Raunit Patel" class="contributor-image" />
                                <p class="contributor-name">Raunit Patel</p>
                                <p class="contributor-institute">IIT Guwahati</p>
                            </div>


                            <div class="contributor-card">
                                <img src="background_imag.jpg" alt="Mohit Yadav" class="contributor-image" />
                                <p class="contributor-name">Mohit Yadav</p>
                                <p class="contributor-institute">IIT Guwahati</p>
                            </div>

                            <div class="contributor-card">
                                <img src="background_imag.jpg" alt="Ravi Teja" class="contributor-image" />
                                <p class="contributor-name">Ravi Teja</p>
                                <p class="contributor-institute">IIT Guwahati</p>
                            </div>

                            <div class="contributor-card">
                                <img src="background_imag.jpg" alt="Sahil Raj" class="contributor-image" />
                                <p class="contributor-name">Sahil Raj</p>
                                <p class="contributor-institute">IIT Guwahati</p>
                            </div>
                        </div>
                    </div>











                </div>


            )}
        </div>
    );
}

export default Center;