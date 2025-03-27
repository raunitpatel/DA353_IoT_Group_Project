import React, { useState } from "react";
import { Table, Pagination, Select } from "antd";
import Plot from "react-plotly.js";

function Center({ selectedArea, selectedAreaName, areaData }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedColumn, setSelectedColumn] = useState("conductivity");
    const pageSize = 5;

    const requiredColumns = [
        "timestamp", "block", "chlorine", "fluoride", "conductivity", "ph", "totaldissolvedsolids", "turbidity", "watertemperature", "target"
    ];

    const filteredData = areaData.map(row =>
        Object.fromEntries(Object.entries(row).filter(([key]) => requiredColumns.includes(key)))
    );

    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const uniqueBlocks = [...new Set(areaData.map(row => row.block))];

    const linePlotData = uniqueBlocks.map(block => ({
        x: areaData.filter(row => row.block === block).map(row => row.timestamp.split(" ")[0]),
        y: areaData.filter(row => row.block === block).map(row => row[selectedColumn]),
        mode: "lines",
        name: block
    }));

    const bubblePlotData = areaData.map(row => ({
        x: row.timestamp.split(" ")[0],
        y: row[selectedColumn],
        mode: "markers",
        marker: {
            size: row.totaldissolvedsolids / 10,
            color: uniqueBlocks.indexOf(row.block),
            opacity: 0.7
        },
        name: row.block
    }));

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
                                data={linePlotData}
                                layout={{ title: "Water Quality Trends", xaxis: { title: "Timestamp" }, yaxis: { title: selectedColumn } }}
                                style={{ width: "100%", height: "400px" }}
                            />
                        </div>
                        <div style={{ width: "48%", paddingLeft: "20px" }}>
                            <h3 style={{ textAlign: "center" }}>Animated Time-Series Bubble Chart</h3>
                            <Plot
                                data={bubblePlotData}
                                layout={{ title: "Water Quality Changes", xaxis: { title: "Timestamp" }, yaxis: { title: selectedColumn } }}
                                style={{ width: "100%", height: "400px" }}
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

                    <div style={{ display: "flex", justifyContent: "center", padding: "10px", }}>
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
                        // padding: "50px",
                        backgroundImage: "url('background_imag.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "100%",
                        // color: "white",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
                    }}
                >
                    <h1 style = {{padding: "0", margin: "0"}}>Welcome to Water Quality Dashboard</h1>
                    <p>Select an area from the sidebar to view detailed water quality information.</p>
                </div>

            )}
        </div>
    );
}

export default Center;
