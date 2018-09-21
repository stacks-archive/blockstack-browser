import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import { Box, Flex } from '@components/ui/components/primitives'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import PropTypes from 'prop-types'
import ContentCopyIcon from 'mdi-react/ContentCopyIcon'

const renderWord = (i, word, condition = true) =>
  condition && <React.Fragment key={word}>{`${word} `}</React.Fragment>

class SeedPage extends React.Component {
  state = {
    seed: this.props.seedString,
    copied: false
  }

  copy() {
    if (!this.state.copied) {
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 2200)
    }
  }

  render() {
    const { next, seed, ...rest } = this.props
    const props = {
      title: {
        children: 'Save all words',
        variant: 'h1'
      },

      content: {
        grow: 1,
        children: (
          <Box mt={3}>
            <Type.small>Your Secret Recovery Key</Type.small>
            <Box bg="whitesmoke" p={3} mt={2} borderRadius="6px 6px 0 0">
              <Type fontSize={3}>
                {seed.map((word, i) => renderWord(i, word, true))}
              </Type>
            </Box>
            <CopyToClipboard text={this.state.seed} onCopy={() => this.copy()}>
              <Flex
                bg="whitesmoke"
                p={3}
                mt={1}
                alignItems="center"
                borderRadius="0 0 6px 6px"
                style={{
                  cursor: 'pointer'
                }}
              >
                <Box pr={1}>
                  <ContentCopyIcon color="rgba(0,0,0,0.25)" size={'1rem'} />
                </Box>
                <Type.small>
                  {this.state.copied ? 'Copied' : 'Copy all words'}
                </Type.small>
              </Flex>
            </CopyToClipboard>
          </Box>
        )
      },
      actions: {
        items: [
          {
            label: 'Continue',
            primary: true,
            onClick: () => next()
          }
        ]
      }
    }
    return <ShellScreen {...rest} {...props} />
  }
}
SeedPage.propTypes = {
  next: PropTypes.func,
  seedString: PropTypes.string,
  seed: PropTypes.array
}
export default SeedPage
