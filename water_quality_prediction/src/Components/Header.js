import React from "react";

function Header() {
    return (
        <nav 
            className="w3-theme-d3" 
            style={{ 
                height: "10vh", 
                display: "flex", 
                alignItems: "center",  
                padding: "0 0 0 3vw",
                margin: "0",
            }}
        >
            <span className="w3-xlarge">H2O | Insights</span>
        </nav>
    );
}

export default Header;
