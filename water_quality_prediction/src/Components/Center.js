import React from "react";

function Center({ selectedArea, selectedAreaName, areaData }) {
    return (
        <div style={{ height: "82.7vh" }}>
            <h2>
                {selectedArea ? `Data for ${selectedArea} - ${selectedAreaName}` : "Select an Area"}
            </h2>

            {selectedArea && areaData.length > 0 ? (
                <table border="1" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {Object.keys(areaData[0]).map((key, index) => (
                                <th key={index} style={{ padding: "10px", background: "#f2f2f2" }}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {areaData.map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((value, i) => (
                                    <td key={i} style={{ padding: "10px" }}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : selectedArea ? (
                <p>No data available for this area.</p>
            ) : (
                <p>Please select an area from the sidebar.</p>
            )}
        </div>
    );
}

export default Center;
