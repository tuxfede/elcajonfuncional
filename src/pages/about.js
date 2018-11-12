import React from "react";
import { Link } from "gatsby";
import Header from "../components/header";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";

export default ({ data }) => {
  return (
  <div style={{ color: `teal` }}>
    <Helmet>
      <meta charSet="utf-8" />
      <title>{data.site.siteMetadata.title}</title>
      <link rel="canonical" href={data.sitePage.path} />
    </Helmet>
    <Link to="/">Home</Link>
    <Header headerText="Contact" />
    <p>Send us a message!</p>
  </div>
  );
};

export const query = graphql`
  query ($path: String!) {
    sitePage(path: {eq: $path}) {
      path
    }
	site {
      siteMetadata {
        title,
		siteUrl
      }
    }
  }
`;
