import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";
import Center from "../Components/Center";

function Homepage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div>
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} ></Sidebar>
            <div
                className="w3-main"
                style={{ marginLeft: isSidebarOpen ? "250px" : "0px", transition: "margin 0.3s" }}
            >
                <Header></Header>
                <Center></Center>
                <Footer></Footer>
            </div>
        </div>
    );
}

export default Homepage;
