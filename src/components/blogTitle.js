import React from "react";
import { StaticQuery, graphql } from "gatsby";

export default () => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <h3 style={{ display: `inline` }}>{data.site.siteMetadata.title}</h3>
    )}
  />
);
