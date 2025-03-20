import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react"; // Added Home Icon

const Sidebar = ({ isOpen, setIsOpen, onAreaSelect }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/areas")
            .then((res) => res.json())
            .then(setMenuItems)
            .catch(console.error);
    }, []);

    // Toggle sidebar visibility
    const toggleSidebar = () => setIsOpen(!isOpen);

    // Toggle dropdown menus
    const toggleDropdown = (index) => {
        setOpenDropdown(prevIndex => prevIndex === index ? null : index);
    };

    return (
        <div>
            {/* Sidebar Toggle Button */}
            <button
                className="w3-button w3-hover-none"
                onClick={toggleSidebar}
                style={{
                    position: "fixed",
                    zIndex: "1000",
                    background: "transparent",
                    border: "none",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    height: "10vh",
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
                    height: "100vh",
                    overflowX: "hidden",
                    transition: "width 0.5s",
                    paddingTop: "10vh",
                }}
            >
                {/* Home Button */}
                <button
                    className="w3-button w3-block w3-left-align w3-theme-d1 w3-padding-large"
                    onClick={() => onAreaSelect(null, null)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}
                >
                    HOME
                </button>

                {/* Area List with Dropdown */}
                {menuItems.map((menu, index) => {
                    const isDropdownOpen = openDropdown === index;
                    return (
                        <div key={index}>
                            <button
                                className="w3-button w3-block w3-left-align w3-theme-d1 w3-padding-large"
                                onClick={() => toggleDropdown(index)}
                            >
                                {menu.title}
                                {isDropdownOpen ? (
                                    <ChevronUp size={20} className="w3-right" />
                                ) : (
                                    <ChevronDown size={20} className="w3-right" />
                                )}
                            </button>

                            {/* Dropdown items */}
                            {isDropdownOpen && (
                                <div
                                    className="w3-container"
                                    style={{
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
                                            onClick={() => onAreaSelect(menu.title, item)}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
