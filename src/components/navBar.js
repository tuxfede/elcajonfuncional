import React from "react";
import { Link } from "gatsby";

const ListLink = props => (
  <li
    style={{
      display: `inline-block`
    }}
  >
    <Link to={props.to}>
      <p>{props.children}</p>
    </Link>
  </li>
);

export default () => {
  return (
    <ul
      style={{
        display: "flex"
      }}
    >
      <ListLink to="/about/">Sobre mí</ListLink>
    </ul>
  );
};
