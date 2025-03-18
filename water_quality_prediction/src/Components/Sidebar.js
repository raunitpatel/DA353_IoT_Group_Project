import React, { useState } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react"; // Icons

const Sidebar = ({ isOpen, setIsOpen }) => {
    const [openDropdown, setOpenDropdown] = useState(null);

    // Toggle sidebar visibility
    const toggleSidebar = () => setIsOpen(!isOpen);

    // Toggle dropdown menus
    const toggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    const menuItems = [
        { title: "Hostels", items: ["Hostel A", "Hostel B", "Hostel C"] },
        { title: "Core", items: ["Lab 1", "Lab 2", "Main Building"] },
        { title: "Quarters", items: ["Block A", "Block B", "Block C"] },
    ];

    return (
        <div>
            {/* Sidebar Toggle Button */}
            <button
                className="w3-button  w3-hover-none"
                onClick={toggleSidebar}
                style={{
                    position: "fixed",
                    top: "15px",
                    zIndex: "1000",
                    background: "transparent", // No white hover effect
                    border: "none",
                    color: "white"
                }}
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Sidebar */}
            <div
                className="w3-sidebar w3-bar-block w3-theme-d5 w3-animate-left"
                style={{
                    width: isOpen ? "250px" : "0",
                    position: "fixed",
                    height: "100%",
                    overflowX: "hidden",
                    transition: "width 0.5s",
                    paddingTop: "4px",
                }}
            >
                <h3 className="w3-bar-item w3-center">Navigation</h3>

                {menuItems.map((menu, index) => (
                    <div key={index}>
                        <button
                            className="w3-button w3-block w3-left-align w3-white w3-padding-large"
                            onClick={() => toggleDropdown(index)}
                        >
                            {menu.title}
                            {openDropdown === index ? (
                                <ChevronUp size={20} className="w3-right" />
                            ) : (
                                <ChevronDown size={20} className="w3-right" />
                            )}
                        </button>

                        {/* Dropdown items */}
                        <div
                            className="w3-container"
                            style={{
                                display: openDropdown === index ? "block" : "none",
                                paddingLeft: "20px",
                                borderLeft: "4px solid #333",
                            }}
                        >
                            {menu.items.map((item, i) => (
                                <button
                                    key={i}
                                    className="w3-button w3-block w3-left-align w3-theme-d5"
                                    style={{
                                        margin: "5px 0", 
                                        padding: "10px",
                                        textAlign: "left", 
                                        border: "none",
                                        background: "transparent",
                                    }}
                                    onClick={() => console.log(`${item} clicked`)} // Replace with actual logic
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
