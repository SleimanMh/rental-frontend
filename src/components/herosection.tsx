"use client";

import Image from "next/image";

const HeroSection = () => {
    return (
        <section
            style={{
                position: "relative",
                height: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start", // Align content to the left
                overflow: "hidden",
            }}
        >
            {/* Left Section with Text */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    padding: "20px 40px", // Increased left padding for better spacing
                    color: "black",
                    maxWidth: "700px",
                    backgroundColor: "rgba(255, 255, 255, 0.6)", // Semi-transparent background
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)", // Subtle shadow for depth
                }}
            >
                <h1
                    style={{
                        fontSize: "50px",
                        fontWeight: "bold",
                        marginBottom: "20px",
                        color: "black",
                    }}
                >
                    Welcome to Car Rental App
                </h1>
                <p style={{ fontSize: "20px", lineHeight: "1.5" }}>
                    Discover the easiest way to rent cars, manage rentals, and explore our
                    comprehensive dashboard designed for admins, accountants, and dealers.
                </p>
            </div>
        </section>
    );
};

export default HeroSection;
