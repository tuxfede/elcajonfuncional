import React from "react";
import { Helmet } from "react-helmet";
import { rhythm } from "../utils/typography";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import aboutPic from "../images/about-federico-lopez-arenillas.jpg";

export default ({ data }) => {
  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{data.site.siteMetadata.title}</title>
        <html lang="es" />
      </Helmet>
      <h1>Sobre mí</h1>
      <img
        src={aboutPic}
        alt="Currículum gráfico de Federico López Arenillas"
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0
        }}
      />
    </Layout>
  );
};

export const query = graphql`
  query($path: String!) {
    sitePage(path: { eq: $path }) {
      path
    }
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
  }
`;
