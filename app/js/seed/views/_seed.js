import React from 'react'
import { ShellScreen, Type, Panel, Panels } from '@blockstack/ui'

const renderWord = (i, word) => (
  <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '15px' }}>
    <Type.h5>#{i + 1}&nbsp;&nbsp;</Type.h5>
    <Type.h2 key={word}>{word}</Type.h2>
  </div>
)

export default ({ next, seed, ...rest }) => {
  const props = {
    title: {
      children: 'Write down all words',
      variant: 'h2'
    },
    content: {
      grow: 1,
      children: (
        <Panels panels={2}>
          <Panel>
            {seed.map(
              (word, i, arr) => i < arr.length / 2 && renderWord(i, word)
            )}
          </Panel>
          <Panel>
            {seed.map(
              (word, i, arr) => i >= arr.length / 2 && renderWord(i, word)
            )}
          </Panel>
        </Panels>
      )
    },
    actions: {
      split: true,
      items: [
        {
          label: 'Copy to Clipboard',
          textOnly: true
        },
        {
          label: 'Next',
          primary: true,
          icon: 'ArrowRightIcon',
          onClick: () => next()
        }
      ]
    }
  }
  return <ShellScreen {...rest} {...props} />
}
