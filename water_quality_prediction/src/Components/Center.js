import React, { useState } from "react";
import { Table, Pagination } from "antd";

function Center({ selectedArea, selectedAreaName, areaData }) {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const paginatedData = areaData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div style={{ height: "85vh", overflowY: "auto", overflowX: "auto", padding: "20px", width: "100%" }}>
            {selectedArea && areaData.length > 0 ? (
                <>
                    <Table
                        dataSource={paginatedData}
                        columns={Object.keys(areaData[0]).map((key) => ({
                            title: key.toUpperCase(),
                            dataIndex: key,
                            key,
                        }))}
                        pagination={false} 
                        bordered
                    />

                    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={areaData.length}
                            onChange={(page) => setCurrentPage(page)}
                            showSizeChanger={false}
                        />
                    </div>
                </>
            ) : selectedArea ? (
                <p>No data available for this area.</p>
            ) : (
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <h1>Welcome to Water Quality Dashboard</h1>
                    <p>Select an area from the sidebar to view detailed water quality information.</p>
                </div>
            )}
        </div>
    );
}

export default Center;
