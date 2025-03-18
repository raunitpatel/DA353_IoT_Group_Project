import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";

function Homepage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div>
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div
                className="w3-main"
                style={{ marginLeft: isSidebarOpen ? "250px" : "0px", transition: "margin 0.3s" }}
            >
                <Header />
                <Footer />
            </div>
        </div>
    );
}

export default Homepage;
