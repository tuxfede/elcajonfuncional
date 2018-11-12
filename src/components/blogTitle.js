import React from "react";
import { StaticQuery, graphql } from "gatsby";
import { rhythm } from "../utils/typography";
import { Link } from "gatsby";

import logoPic from "../images/caja.svg";

export default () => {
  return (
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
      render={data => {
        return (
          <Link
            to="/"
            style={{
              display: "flex",
              marginBottom: rhythm(1),
              textShadow: `none`,
              backgroundImage: `none`
            }}
          >
            <img
              src={logoPic}
              alt={`Logo El cajón funcional`}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                width: rhythm(3),
                height: rhythm(3)
              }}
            />
            <h3>{data.site.siteMetadata.title}</h3>
          </Link>
        );
      }}
    />
  );
};
