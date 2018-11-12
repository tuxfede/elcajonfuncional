import React from "react";
import BlogTitle from "./blogTitle";
import NavBar from "./navBar";
export default ({ children, data }) => (
  <div style={{ margin: `0 auto`, maxWidth: 650, padding: `1.25rem 1rem` }}>
    <header style={{ marginBottom: `1.5rem` }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <BlogTitle />
        <NavBar />
      </div>
    </header>
    {children}
  </div>
);
