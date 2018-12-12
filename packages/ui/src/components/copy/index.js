import React from 'react'
import { Flex, Tooltip } from '../../'
import CopyIcon from 'mdi-react/ContentCopyIcon'
import { Hover, State } from 'react-powerplug'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Copy = ({ value = '', ...rest }) =>
  value === '' ? (
    console.error('You need to pass a value to be copied')
  ) : (
    <State initial={{ copied: false }}>
      {({ state: { copied }, setState }) => {
        const handleCopy = () => {
          setState((state) => ({ copied: !state.copied }))
        }
        const resetState = () => {
          setState(() => ({ copied: false }))
        }

        return (
          <Hover>
            {({ hovered, bind }) => (
              <Flex
                color="hsl(205, 30%, 70%)"
                alignItems="center"
                justifyContent="center"
                opacity={hovered ? 1 : 0.5}
                cursor="pointer"
                {...bind}
                onMouseLeave={() => {
                  bind.onMouseLeave()
                  if (copied) {
                    resetState()
                  }
                }}
                {...rest}
              >
                <Tooltip text={copied ? 'Copied!' : 'Copy'}>
                  <CopyToClipboard text={value} onCopy={handleCopy}>
                    <Flex py={2} px={3}>
                      <CopyIcon size={18} />
                    </Flex>
                  </CopyToClipboard>
                </Tooltip>
              </Flex>
            )}
          </Hover>
        )
      }}
    </State>
  )

export { Copy }
