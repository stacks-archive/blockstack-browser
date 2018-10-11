import React from 'react'
import { Type } from '../../src'

const general = [
  { path: '/', name: 'Getting Started' },
  { path: '/system-props', name: 'System Props' },
  { path: '/theme', name: 'Theme' }
]

const components = [
  { path: '/box', name: 'Box' },
  { path: '/flex', name: 'Flex' },
  { path: '/inline', name: 'Inline' },
  { path: '/typography', name: 'Type' },
  { path: '/button', name: 'Button' },
  { path: '/card', name: 'Card' },
  { path: '/input', name: 'Input' }
]
export const routes = [
  {
    name: (
      <>
        Blockstack
        <br />
        Design System
      </>
    ),
    routes: general
  },
  {
    name: 'Components',
    routes: components
  }
]
