
import React, { useState } from "react";
import { Table, Pagination } from "antd";
import Plot from "react-plotly.js";
import GaugeChart from 'react-gauge-chart';

function Center({ selectedArea, selectedAreaName, areaData }) {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const requiredColumns = [
        "timestamp", "block", "chlorine", "fluoride", "conductivity", "ph", "totaldissolvedsolids", "turbidity", "watertemperature", "target"
    ];

    const standards = {
        ph: { min: 6.5, max: 8.5 },
        chlorine: { min: 0.5, max: 4.0 },
        fluoride: { min: 0.5, max: 1.5 },
        conductivity: { min: 50, max: 1500 },
        turbidity: { min: 0, max: 5 },
        totaldissolvedsolids: { min: 0, max: 1000 },
        watertemperature: { min: 10, max: 25 }
    };
    const columnUnits = {
        timestamp: '',
        block: '',
        chlorine: '(mg/L)',
        fluoride: '(mg/L)',
        conductivity: '(µS/cm)',
        ph: '',
        totaldissolvedsolids: '(mg/L)',
        turbidity: '(NTU)',
        watertemperature: '(°C)',
        target: ''
      };

    const filteredData = areaData.map(row =>
        Object.fromEntries(Object.entries(row).filter(([key]) => requiredColumns.includes(key)))
    );

    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const uniqueBlocks = [...new Set(areaData.map(row => row.block))];
    const getStandardLines = (col) => {
        if (!standards[col]) return [];
    
        const { min, max } = standards[col];
    
        return [
            {
                type: "line",
                xref: "paper",
                x0: 0,
                x1: 1,
                y0: min,
                y1: min,
                line: {
                    color: "green",
                    width: 2,
                    dash: "dash"
                }
            },
            {
                type: "line",
                xref: "paper",
                x0: 0,
                x1: 1,
                y0: max,
                y1: max,
                line: {
                    color: "red",
                    width: 2,
                    dash: "dash"
                }
            }
        ];
    };
    

        const renderPlots = () => {
            const plots = [];
        
            const getBlockData = (col, latestOnly = false) =>
                uniqueBlocks.map(blockName => {
                    let rows = areaData
                        .filter(row => row.block === blockName && row[col] !== undefined && row[col] !== null)
                        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    if (latestOnly) rows = rows.slice(-20);
                    return { blockName, rows };
                });
        
            // 1. Violin for chlorine & fluoride
            ["chlorine", "fluoride"].forEach(col => {
                const traces = getBlockData(col).map(({ blockName, rows }) => ({
                    y: rows.map(r => parseFloat(r[col])),
                    type: "violin",
                    name: blockName,
                    box: { visible: true },
                }));
        
                plots.push(
                    <div key={col} style={{ width: "48%", margin: "1%" }}>
                        <h4 style={{ textAlign: "center" }}>{col.toUpperCase()}</h4>
                        <Plot
                            data={traces}
                            layout={{ margin: { t: 40 }, yaxis: { title: col }, shapes: getStandardLines(col) }}
                            useResizeHandler
                            style={{ width: "100%", height: "300px" }}
                        />
                    </div>
                );
            });
        
            // 2. Line for conductivity (all rows)
            ["conductivity"].forEach(col => {
                const traces = getBlockData(col, true).map(({ blockName, rows }) => ({
                    x: rows.map(r => new Date(r.timestamp).toISOString()),
                    y: rows.map(r => parseFloat(r[col])),
                    type: "scatter",
                    mode: "lines+markers",
                    name: blockName,
                }));
        
                plots.push(
                    <div key={col} style={{ width: "48%", margin: "1%" }}>
                        <h4 style={{ textAlign: "center" }}>{col.toUpperCase()}</h4>
                        <Plot
                            data={traces}
                            layout={{
                                xaxis: { title: "Timestamp", type: "date" },
                                yaxis: { title: col },
                                margin: { t: 40 },
                                shapes: getStandardLines(col)
                            }}
                            useResizeHandler
                            style={{ width: "100%", height: "300px" }}
                        />
                    </div>
                );
            });
            
        
            // 3. Box for ph & totaldissolvedsolids
            ["ph", "totaldissolvedsolids"].forEach(col => {
                const traces = getBlockData(col).map(({ blockName, rows }) => ({
                    y: rows.map(r => parseFloat(r[col])),
                    type: "box",
                    name: blockName,
                }));
        
                plots.push(
                    <div key={col} style={{ width: "48%", margin: "1%" }}>
                        <h4 style={{ textAlign: "center" }}>{col.toUpperCase()}</h4>
                        <Plot
                            data={traces}
                            layout={{ margin: { t: 40 }, yaxis: { title: col } , shapes: getStandardLines(col)}}
                            useResizeHandler
                            style={{ width: "100%", height: "300px" }}
                        />
                    </div>
                );
            });
        
            // 4. Line for turbidity & watertemperature (latest 20 only)
            ["turbidity", "watertemperature"].forEach(col => {
                const traces = getBlockData(col, true).map(({ blockName, rows }) => ({
                    x: rows.map(r => new Date(r.timestamp).toISOString()),
                    y: rows.map(r => parseFloat(r[col])),
                    type: "scatter",
                    mode: "lines+markers",
                    name: blockName,
                }));
        
                plots.push(
                    <div key={col} style={{ width: "48%", margin: "1%" }}>
                        <h4 style={{ textAlign: "center" }}>{col.toUpperCase()}</h4>
                        <Plot
                            data={traces}
                            layout={{
                                xaxis: { title: "Timestamp", type: "date" },
                                yaxis: { title: col },
                                margin: { t: 40 },
                                shapes: getStandardLines(col)
                            }}
                            useResizeHandler
                            style={{ width: "100%", height: "300px" }}
                        />
                    </div>
                );
            });
        
            // 5. Gauge for target (all blocks together)
            
            const renderGaugeChart = () => {
                return (
                    <div style={{ width: '100%', marginTop: '30px' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '5px' }}>
                            Average Water Quality Value (last 20 readings)
                        </h3>
                        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                            Closer to <strong>100</strong> indicates better water quality
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {uniqueBlocks.map((blockName, idx) => {
                                const blockRows = areaData
                                    .filter(row => row.block === blockName && row.target !== undefined && row.target !== null)
                                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                                    .slice(-20);
            
                                const values = blockRows.map(row => parseFloat(row.target)).filter(v => !isNaN(v));
                                const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
            
                                return (
                                    <div key={blockName} style={{ width: '400px', margin: '10px' }}>
                                        <h5 style={{ textAlign: 'center' }}>{blockName}</h5>
                                        <GaugeChart
                                            id={`gauge-${idx}`}
                                            nrOfLevels={100}

                                            percent={avg}
                                            animate={false}
                                            arcPadding={0}
                                            arcWidth={0.3}
                                            colors={["#ff4d4f", "#fadb14", "#52c41a"]} // Red to Green
                                            needleColor="#000"
                                            needleBaseColor="#000"
                                            textColor="#333"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            };
            
            
            
            plots.push(renderGaugeChart());

        
            // Render in rows of 2
            const rows = [];
            for (let i = 0; i < plots.length; i += 2) {
                rows.push(
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                        {plots[i]}
                        {plots[i + 1] || <div style={{ width: "48%" }} />}
                    </div>
                );
            }
        
            return rows;
        };
        
        

    return (
        <div style={{ height: "85vh", overflowY: "auto", overflowX: "auto", width: "100%" }}>
            {selectedArea && areaData.length > 0 ? (
                <>
                    <h1 style={{ textAlign: "center", fontWeight: "500" }}>
                        {selectedAreaName} Water Quality Data
                    </h1>

                    {/* Charts Section */}
                    <div style={{ padding: "20px", borderBottom: "2px solid gray", marginBottom: "30px" }}>
                        {renderPlots()}
                    </div>

                    {/* Table Section */}
                    <div style={{ marginTop: "40px" }}>
                        <Table
                            dataSource={paginatedData}
                            columns={requiredColumns.map((key) => ({
                                title: `${key.toUpperCase()} ${columnUnits[key] || ''}`,
                                dataIndex: key,
                                key
                            }))}
                            pagination={false}
                            bordered
                            scroll={{ x: 'max-content' }}
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
                <main className="grid">
                    <section className="content item1">
                        <br /><br /><br /><br /><br /><br /><br /><br />
                        <h1>Water Quality DashBoard</h1>
                        <p>Is IIT Guwahati's Water as Pure as It Should Be?</p>
                    </section>
                    <section className="card item2">
                        <h3>Turbidity</h3>
                        <h4>Expected Value: ≤ 5NTU</h4>
                        <p>Indicates the presence of suspended particles in water.</p>
                    </section>
                    <section className="card item3"></section>
                    <section className="card item4"></section>
                    <section className="card item5">
                        <h3>Water Temperature</h3>
                        <h4>Expected Value: Around 10-15°C</h4>
                        <p>Affects taste, solubility of gases, and microbial growth.</p>
                    </section>
                    <section className="card item7">
                        <h3>Total Dissolved Solids (TDS)</h3>
                        <h4>Expected Value: ≤ 600 mg/L (Good), ≤ 1,000 mg/L (Acceptable)</h4>
                        <p>Measures the total amount of dissolved substances in water.</p>
                    </section>
                    <section className="card item8">
                        <h3>Conductivity</h3>
                        <h4>Expected Value: Typically 500-1,000 µS/cm</h4>
                        <p>Indicates water’s ability to conduct electricity.</p>
                    </section>
                    <section className="card item9">
                        <h3>Chlorine</h3>
                        <h4>Expected Value: ≤4.0 mg/L</h4>
                        <p>Ensures ongoing protection against microbial contamination.</p>
                    </section>
                    <section className="card item10">
                        <h3>Fluoride</h3>
                        <h4>Expected Value: 1.5 mg/L</h4>
                        <p>Controlled amounts prevents dental caries, but excessive levels can cause fluorosis.</p>
                    </section>
                    <section className="card item11">
                        <h3>pH</h3>
                        <h4>Expected Value: 6.5 to 8.5</h4>
                        <p>Measures acidity or alkalinity of the water.</p>
                    </section>
                </main>
            )}
        </div>
    );
}

export default Center;
