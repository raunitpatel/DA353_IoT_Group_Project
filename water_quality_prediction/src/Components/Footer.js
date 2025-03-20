import React from "react";

function Footer() {
    return (
        <footer 
            className="w3-theme-d3" 
            style={{ 
                height: "5vh", 
                display: "flex", 
                alignItems: "center",  // Centers text vertically
                margin: "0",
                paddingLeft: "1vw",
            }}
        >
            <h5>Stay Connected with H2O | Insights</h5>
        </footer>
    );
}

export default Footer;
