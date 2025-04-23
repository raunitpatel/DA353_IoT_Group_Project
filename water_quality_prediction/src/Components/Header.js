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
            padding: "0 50px",
            margin: "0",
            textDecoration: "none",
        }}
    >
        <span className="w3-xlarge"  style={{ fontSize: "1.8rem",fontWeight:"bold"}}>H2O | Insights</span>
    
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img 
                src="IITG_logo.png"  
                alt="Logo"
                style={{ height: "50px", width: "50px", objectFit: "contain" }}
            />
            <span className="mfsdsai" style={{ fontSize: "1.8rem"}}>MFSDSAI</span>
        </span>
    </nav>
    );
}

export default Header;
