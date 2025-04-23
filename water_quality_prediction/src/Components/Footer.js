import React from "react";

function Footer() {
    return (
        <footer 
        className="w3-theme-d3" 
        style={{ 
            height: "5vh", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",  // Add this
            padding: "0 1vw",                 // Clean horizontal spacing
        }}
    >
        <span>Stay Connected with H2O | Insights</span>
        <a 
            href="https://www.who.int/publications/i/item/9789241548151" 
            target="_blank"                  // fixed target value
            rel="noopener noreferrer"       // recommended for security
            style={{ textDecoration: "none", color: "inherit" }}
        >
            WHO Guidelines for water quality
        </a>
    </footer>
    
    );
}

export default Footer;
