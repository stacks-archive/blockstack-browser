import { css } from 'styled-components'

import chroma from 'chroma-js'

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}
const trans = css`
  transition: 0.08s all ease-in-out;
`

const firstLetter = (string) => string.charAt(0)

const stringToColor = (string) => {
  let hash = 0
  let color = '#'

  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).substr(-2)
  }

  return chroma(color)
    .set('lch.l', 66)
    .hex()
}

export { slugify, trans, firstLetter, stringToColor }
