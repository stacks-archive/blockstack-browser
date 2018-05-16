import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'

export default ({ ...rest }) => {
  const props = {
    title: {
      children: 'Restore your Blockstack ID'
    },
    content: {
      grow: 1,
      children: (
        <React.Fragment>
          <Type.p>Proccessing your request...</Type.p>
        </React.Fragment>
      )
    }
  }
  return <ShellScreen {...rest} {...props} />
}
