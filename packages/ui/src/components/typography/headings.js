import * as React from 'react'
import styled from 'styled-components'
import { Inline } from '../primitives'

const Headings = styled.div``
export const H1 = (p) => <Inline is="h1" {...p} />
H1.defaultProps = {
  fontFamily: 'brand',
  lineHeight: 1.5,
  fontSize: 7,
  color: 'blue',
  fontWeight: 'light',
  m: 0
}
const H2 = (p) => <Inline is="h2" {...p} />
H2.defaultProps = {
  lineHeight: 1.5,
  fontSize: 6,
  color: 'blue.dark',
  fontWeight: 'light',
  fontFamily: 'default',
  m: 0
}
const H3 = (p) => <Inline is="h3" {...p} />
H3.defaultProps = {
  lineHeight: 1.5,
  fontSize: 5,
  color: 'blue.dark',
  fontWeight: 'normal',
  fontFamily: 'default',
  m: 0
}
const H4 = (p) => <Inline is="h4" {...p} />
H4.defaultProps = {
  lineHeight: 1.5,
  fontSize: 4,
  fontWeight: 'normal',
  fontFamily: 'default',
  color: 'blue.dark',
  m: 0
}
const H5 = (p) => <Inline is="h5" {...p} />
H5.defaultProps = {
  lineHeight: 1.5,
  fontSize: 3,
  fontFamily: 'default',
  fontWeight: 'semibold',
  color: 'blue.dark',
  m: 0
}

const H6 = (p) => <Inline is="h6" {...p} />
H6.defaultProps = {
  lineHeight: 1.5,
  fontSize: 2,
  fontFamily: 'default',
  fontWeight: 'semibold',
  color: 'blue.mid',
  m: 0
}

Headings.H1 = (props) => <H1 {...props} />
Headings.H2 = (props) => <H2 {...props} />
Headings.H3 = (props) => <H3 {...props} />
Headings.H4 = (props) => <H4 {...props} />
Headings.H5 = (props) => <H5 {...props} />
Headings.H6 = (props) => <H6 {...props} />

export { Headings }
