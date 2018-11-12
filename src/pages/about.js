import React from "react";
import { Link } from "gatsby";
import Header from "../components/header";
import { Helmet } from "react-helmet";

export default () => (
  <div style={{ color: `teal` }}>
    <Helmet>
      <meta charSet="utf-8" />
      <title>My Title</title>
      <link rel="canonical" href="http://mysite.com/example" />
    </Helmet>
    <Link to="/">Home</Link>
    <Header headerText="Contact" />
    <p>Send us a message!</p>
  </div>
);
