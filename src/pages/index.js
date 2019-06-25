import React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../components/layout";
import { Helmet } from "react-helmet";

var postElementStyle = {
  marginBottom: '2em'
};

export default ({ data }) => (
  <Layout>
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{data.site.siteMetadata.title}</title>
        <html lang="es" />
      </Helmet>
      <h1>Últimas entradas del blog</h1>
      <h4>{data.allMarkdownRemark.totalCount} Entrada/s</h4>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id} style={postElementStyle}>
          <Link to={node.fields.slug}>
            <h3 style={{ display: "inline" }}>{node.frontmatter.title}</h3>
            <span> — {node.frontmatter.date}</span>
            <p style={{ color: "dimgray" }}>{node.excerpt}</p>
          </Link>
        </div>
      ))}
    </div>
  </Layout>
);

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
  }
`;
