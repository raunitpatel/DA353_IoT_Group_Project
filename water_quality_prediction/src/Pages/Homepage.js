import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";
import Center from "../Components/Center";

function Homepage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedAreaName, setSelectedAreaName] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [areaData, setAreaData] = useState([]);

    // Fetch menu items (unique areas and sub-areas) from backend
    useEffect(() => {
        fetch("http://127.0.0.1:5000/areas")
            .then((res) => res.json())
            .then((data) => setMenuItems(data))
            .catch((err) => console.error("Error fetching areas:", err));
    }, []);

    // Fetch water quality data when an area is selected
    useEffect(() => {
        if (selectedArea && selectedAreaName) {
            fetch("http://127.0.0.1:5000/data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ area: selectedArea, areaName: selectedAreaName }),
            })
                .then((res) => res.json())
                .then((data) => setAreaData(data))
                .catch((err) => console.error("Error fetching data:", err));
        }
    }, [selectedArea, selectedAreaName]);

    return (
        <div>
            <Sidebar 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
                onAreaSelect={(area, areaName) => {
                    setSelectedArea(area);
                    setSelectedAreaName(areaName);
                }} 
                menuItems={menuItems} 
            />
            <div
                className="w3-main"
                style={{ marginLeft: isSidebarOpen ? "250px" : "0px", transition: "margin 0.3s" }}
            >
                <Header />
                <Center selectedArea={selectedArea} selectedAreaName={selectedAreaName} areaData={areaData} />
                <Footer />
            </div>
        </div>
    );
}

export default Homepage;


