import React from "react";

function Header() {
    return (
        <nav 
            className="w3-theme-d3" 
            style={{ 
                height: "10vh", 
                display: "flex", 
                alignItems: "center",  
                justifyContent: "space-between",
                padding: "0 50px 0 50px",
                margin: "0",
                textDecoration: "none",
            }}
        >
            <span className="w3-xlarge">H2O | Insights</span>
            <a href="https://www.who.int/publications/i/item/9789241548151" target="blank">WHO Guidelines for water quality</a>
        </nav>
    );
}

export default Header;
