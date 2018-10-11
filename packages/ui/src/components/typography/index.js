import React from 'react'
import { Headings } from './headings'
import Body from './body'
import { Inline } from '../primitives'

const Type = (p) => <Inline {...p} />

Type.h1 = Headings.H1
Type.h2 = Headings.H2
Type.h3 = Headings.H3
Type.h4 = Headings.H4
Type.h5 = Headings.H5
Type.h6 = Headings.H6
Type.p = Body.p
Type.span = Body.span
Type.ui = Body.ui
Type.a = Body.a
Type.strong = Body.strong
Type.em = Body.em
Type.ul = Body.ul
Type.ol = Body.ol
Type.li = Body.li
Type.oli = Body.oli
Type.pre = Body.pre

const basePropTypes = {}

Type.h1.propTypes = {
  ...basePropTypes
}
Type.h2.propTypes = {
  ...basePropTypes
}
Type.h3.propTypes = {
  ...basePropTypes
}
Type.h4.propTypes = {
  ...basePropTypes
}
Type.h5.propTypes = {
  ...basePropTypes
}
Type.h6.propTypes = {
  ...basePropTypes
}
Type.p.propTypes = {
  ...basePropTypes
}
Type.strong.propTypes = {
  ...basePropTypes
}
Type.em.propTypes = {
  ...basePropTypes
}
Type.ul.propTypes = {
  ...basePropTypes
}
Type.ol.propTypes = {
  ...basePropTypes
}
Type.li.propTypes = {
  ...basePropTypes
}
Type.oli.propTypes = {
  ...basePropTypes
}
Type.pre.propTypes = {
  ...basePropTypes
}

Type.propTypes = {
  ...basePropTypes
}

export { Type }
