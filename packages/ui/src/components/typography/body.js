import * as React from 'react'
import { Inline } from '../primitives'

const defaultProps = {
  fontSize: 2,
  lineHeight: 1.25
}

const Body = (p) => <Inline is="div" {...p} />
Body.defaultProps = {
  ...defaultProps
}
const P = (p) => <Inline is="p" {...p} />
P.defaultProps = {
  ...defaultProps
}

const Span = (p) => <Inline is="span" {...p} />
Span.defaultProps = {
  ...defaultProps
}
const Ui = (p) => <Inline is="span" {...p} />
Ui.defaultProps = {
  ...defaultProps
}
const A = (p) => <Inline is="a" {...p} />
A.defaultProps = {
  ...defaultProps
}

const Strong = (p) => <Inline is="strong" {...p} />
Strong.defaultProps = {
  ...defaultProps
}
const Em = (p) => <Inline is="em" {...p} />
Em.defaultProps = {
  ...defaultProps
}
const Ul = (p) => <Inline is="ul" {...p} />
Ul.defaultProps = {
  ...defaultProps
}
const Ol = (p) => <Inline is="ol" {...p} />
Ol.defaultProps = {
  ...defaultProps
}
const Li = (p) => <Inline is="li" {...p} />
Li.defaultProps = {
  ...defaultProps
}
const Pre = (p) => <Inline is="pre" {...p} />
Pre.defaultProps = {
  ...defaultProps
}

Body.p = (props) => <P {...props} />
Body.span = (props) => <Span {...props} />
Body.ui = (props) => <Ui display="inline-block" {...props} />
Body.a = (props) => <A display="inline-block" {...props} />
Body.strong = (props) => <Strong {...props} />
Body.em = (props) => <Em {...props} />
Body.ul = (props) => <Ul {...props} />
Body.ol = (props) => <Ol {...props} />
Body.li = (props) => <Li {...props} />
Body.oli = (props) => <Li {...props} />
Body.pre = (props) => <Pre {...props} />

export default Body
