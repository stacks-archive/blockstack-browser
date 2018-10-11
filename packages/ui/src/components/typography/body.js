import * as React from 'react'
import { Inline } from '../primitives'

const Body = (p) => <Inline is="div" {...p} />
Body.defaultProps = {
  fontSize: 2,
  fontFamily: 'ui',
  lineHeight: 1.25
}
const P = (p) => <Inline is="p" {...p} />
P.defaultProps = {
  fontSize: 2,
  fontFamily: 'ui',
  lineHeight: 1.25
}

const Span = (p) => <Inline is="span" {...p} />
Span.defaultProps = {
  fontSize: 2,
  fontFamily: 'ui',
  lineHeight: 1.25
}
const Ui = (p) => <Inline is="span" {...p} />
Ui.defaultProps = {
  fontSize: 2,
  fontFamily: 'ui',
  lineHeight: 1.25
}
const A = (p) => <Inline is="a" {...p} />
A.defaultProps = {
  fontSize: 2,
  fontFamily: 'ui',
  lineHeight: 1.25
}

const Strong = (p) => <Inline is="strong" {...p} />
Strong.defaultProps = {
  fontSize: 2,
  fontFamily: 'ui',
  lineHeight: 1.25
}
const Em = (p) => <Inline is="em" {...p} />
Em.defaultProps = {
  fontSize: 2,
  fontFamily: 'ui',
  lineHeight: 1.25
}
const Ul = (p) => <Inline is="ul" {...p} />
Ul.defaultProps = {
  fontSize: 2,
  fontFamily: 'ui',
  lineHeight: 1.25
}
const Ol = (p) => <Inline is="ol" {...p} />
Ol.defaultProps = {
  fontSize: 2,
  fontFamily: 'ui',
  lineHeight: 1.25
}
const Li = (p) => <Inline is="li" {...p} />
Li.defaultProps = {
  fontSize: 2,
  fontFamily: 'ui',
  lineHeight: 1.25
}
const Pre = (p) => <Inline is="pre" {...p} />
Pre.defaultProps = {
  fontSize: 2,
  lineHeight: 1.25
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
