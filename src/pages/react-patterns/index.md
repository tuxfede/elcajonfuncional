---
title: "Patrones react"
date: "2019-07-10"
---

## Composición de estilos

Objetivos:

- Crear un sistema cuyo diseño visual quede bien definido
- Facilitar consistencia visual entre aplicaciones
- Performance
- Mantenibilidad
- Legitibilidad
- Facilidad para eliminar estilos obsoletos
- Rapidez para crear nuevos elementos UI
- Encapsular estilos

> Referencias:
>
> - [Patterns for Style Composition in React](https://jxnblk.com/blog/patterns-for-style-composition-in-react/)

### Componentes UI funcionales sin estado

> Separar las partes de la aplicación asociadas al estado.

Routes, views, containers, forms, layouts, etc. no deberían incluir ningún estilo o clase en su interior.
Estos componentes pesados deberán estar formados por componentes UI sin estado (presentational components)

Por ejemplo, un formulario no debería tener 'className' o 'style' (se considera un code smell).
Cada componente incluído en el formulario debe encapsular su propio estilo, de tal forma que dicho estilo se convierta en un detalle de implementación.

### Módulo de estilos

> Definir estilos a nivel de la aplicación en su propio módulo.

Las propiedades comunes de la aplicación, que se usarán en varios componentes (colores, espaciados, etc.), deberán definirse en su propio módulo.
Ojo! Cada Componente deberá tener su propio CSS (aislado del resto de componentes), pero para dar uniformidad a la aplicación, existen ciertas propiedades que deberán ser comunes.

Por ejemplo, el fichero `styles.js` podría contener:

```js
export const white = "#fff";
export const black = "#111";
export const blue = "#07c";

export const colors = {
  white,
  black,
  blue
};

export const space = [0, 8, 16, 32, 64];

const styles = {
  bold: 600,
  space,
  colors
};

export default styles;
```

y un componente 'Button' podría usar dicho estilo:

```js
import React from "react";
import { bold, space, colors } from "./styles";

const Button = ({ ...props }) => {
  const sx = {
    fontFamily: "inherit",
    fontSize: "inherit",
    fontWeight: bold,
    textDecoration: "none",
    display: "inline-block",
    margin: 0,
    paddingTop: space[1],
    paddingBottom: space[1],
    paddingLeft: space[2],
    paddingRight: space[2],
    border: 0,
    color: colors.white,
    backgroundColor: colors.blue,
    WebkitAppearance: "none",
    MozAppearance: "none"
  };

  return <button {...props} style={sx} />;
};
```

### Funciones de estilo

> Usar funciones auxiliares cuando sea necesario

Se pueden crear y usar funciones auxiliares para dar estilo a los elementos
Por ejemplo:

```js
const darken = n => `rgba(0, 0, 0, ${n})`;
darken(1 / 8); // 'rgba(0, 0, 0, 0.125)'
```

Como alternativa, también se pueden usar módulos npm. Por ejemplo, `chroma-js`:

```js
import chroma from "chroma-js";

const alpha = color => a =>
  chroma(color)
    .alpha(a)
    .css();

const darken = alpha("#000");

const shade = [
  darken(0),
  darken(1 / 8),
  darken(1 / 4)
  // ...
];

const blueAlpha = [
  alpha(blue)(0),
  alpha(blue)(1 / 4),
  alpha(blue)(1 / 2),
  alpha(blue)(3 / 4),
  alpha(blue)(1)
];
```

### Componentes base

> Usar composición en lugar de herencia

Se pueden trasladar propiedades asociadas a css a propiedades del componente, de forma que éste sea personalizable
Por ejemplo, crear un `Button` base:

```js
onst Button = ({
  big,
  color = colors.white,
  backgroundColor = colors.blue,
  ...props
}) => {
  const sx = {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: bold,
    textDecoration: 'none',
    display: 'inline-block',
    margin: 0,
    paddingTop: big ? space[2] : space[1],
    paddingBottom: big ? space[2] : space[1],
    paddingLeft: space[2],
    paddingRight: space[2],
    border: 0,
    color,
    backgroundColor,
    WebkitAppearance: 'none',
    MozAppearance: 'none'
  }

  return (
    <button {...props} style={sx} />
  )
}
```

Este botón puede usarse:

```js
// Usage example
<div>
  <Button>Blue Button</Button>
  <Button big backgroundColor={colors.red}>
    Big Red Button
  </Button>
</div>
```

De esta forma, se pueden crear botones especializados:

```js
import React from "react";
import Button from "./Button";

const ButtonSecondary = props => (
  <Button {...props} color={colors.black} backgroundColor={colors.lightblue} />
);

const ButtonBig = props => <Button {...props} big />;
const ButtonGreen = props => (
  <Button {...props} backgroundColor={colors.green} />
);
const ButtonRed = props => <Button {...props} backgroundColor={colors.red} />;
const ButtonOutline = props => <Button {...props} outline />;
```

De forma que cada botón pueda usarse de forma sencilla:

```js
// Usage example
<div>
  <Button>Normal Button</Button>
  <ButtonSecondary>Secondary Button</ButtonSecondary>
</div>
```

La tipografía también puede construirse por composición. Por ejemplo:

```js
import React from "react";
import { alternateFont, typeScale, boldFontWeight } from "./styles";

const Text = ({
  tag = "span",
  size = 4,
  alt,
  center,
  bold,
  caps,
  ...props
}) => {
  const Tag = tag;
  const sx = {
    fontFamily: alt ? alternateFont : null,
    fontSize: typeScale[size],
    fontWeight: bold ? boldFontWeight : null,
    textAlign: center ? "center" : null,
    textTransform: caps ? "uppercase" : null
  };

  return <Tag {...props} style={sx} />;
};

const LeadText = props => <Text {...props} tag="p" size={3} />;
const Caps = props => <Text {...props} caps />;
const MetaText = props => <Text {...props} size={5} caps />;
const AltParagraph = props => <Text {...props} tag="p" alt />;

const CapsButton = ({ children, ...props }) => (
  <Button {...props}>
    <Caps>{children}</Caps>
  </Button>
);
```

```js
// Usage example
<div>
  <LeadText>
    This is a lead with some <Caps>all caps</Caps>. It has a larger font size
    than the default paragraph.
  </LeadText>
  <MetaText>This is smaller text, like form helper copy.</MetaText>
</div>
```

### Higher Order Components

> Crear componentes sin estado y dotar de estado usando HOC

El `estado de la aplicación` deberá ir en el nivel más alto de React (se puede usar redux).
Si hay un componente UI aislado que solo requieren una mínima interacción con el estado, se puede almacenar el estado en el interior del componente.
Para facilitar la reusabilidad, el componente estará formado por un componente sin estado (presentational) y un HOC que le proporciona el estado a través de propiedades

## Tachyons y Styled Componentes

> Referencia:
>
> - [Tachyons components](https://varun.ca/tachyons-components/)
> - [Enhaced Workflow with styled components and tachyons](https://medium.com/swlh/enhanced-workflow-with-styled-components-and-tachyons-e14a8ed4d25a)
> - [Tachyons + Styled Components = Pure Joy](https://medium.com/@jikkujose/tachyons-styled-components-pure-joy-6173d3888548)

### Problemas de Tachyions

Con Tachyions,

- el código fuente del componente queda repleto de código css que lo hace poco legible.

## Solución: Styled Components

En Styled components, podemos pasarle clases a los componentes a trabés de la función `attrs`.
De esta forma, podemos crear components básicos y escribir el CSS como literal strings, así como agregar estilos personalizados.

```js
import React from "react";
import styled from "styled-components";
export const Container = styled.div.attrs({
  className: `cf di h-100 w-100 center-ns ph5-ns`
})``;
export const HalfContainer = styled.div.attrs({
  className: `fl w-100 w-50-l h-100 h-75-m pa2 flex flex-column items-center`
})``;
export const ReflowContainer = styled.div.attrs({
  className: `fl w-100 w-50-ns vh-0 vh-0-m vh-75-ns pa2 flex-ns flex-m flex-column-ns flex-row-m items-center-ns`
})``;
export const Background = styled.div.attrs({
  className: `cover contain dn dn-m di-ns w-25-ns h-25-ns w-100-ns h-100-ns vh-100 pa5`
})`
  background-image: url(${props => props.image});
  background-repeat: no-repeat;
  ${bgProps};
`;
```

Ejemplo de uso:

```js
<Container>
  <ReflowContainer>
    <Background image={landingBackground} />
  </ReflowContainer>
  <HalfContainer>
    <TopHead right>Sign In</TopHead>
    <StyledContentText />
    <Button onClick={this.handleClick} center px={`4rem`}>
       Sign Up
     </Button>
    <StyledLink to="/app/login">Log In</LoginLink>
   </HalfContainer>
</Container>
```

## Styled-system

> Permite crear UI components con estilos pasados como propiedades .
> Referencias:
>
> - [styled-system](https://styled-system.com)
> - [Blog varun](https://varun.ca/styled-system/)
> - [Build better component libraries with styled system](https://medium.com/styled-components/build-better-component-libraries-with-styled-system-4951653d54ee)

Se trata de una combinación de styled components y tachyons que facilita la creación de temas, personalización a través de props, etc:

Ejemplo:

```js
import styled from "styled-components";
import { color } from "styled-system";

const Box = styled.div`
  ${color}
`;

export default Box;
```

Tras ello, el componente tendrá disponible dos propiedades: color y bg.
Gracias a styled-components, se pueden crear temas y pasárselo a todos los componentes
