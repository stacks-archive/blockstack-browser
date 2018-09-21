import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import { Box, Flex } from '@components/ui/components/primitives'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import PropTypes from 'prop-types'
import ContentCopyIcon from 'mdi-react/ContentCopyIcon'
import { Hover } from 'react-powerplug'

const renderWord = (i, word, condition = true) =>
  condition && <React.Fragment key={word}>{`${word} `}</React.Fragment>

const WordBox = ({ seed, ...p }) => (
  <Box bg="whitesmoke" p={3} mt={2} borderRadius="6px 6px 0 0" {...p}>
    <Type fontSize={3}>{seed.map((word, i) => renderWord(i, word, true))}</Type>
  </Box>
)

const CopyButton = p => (
  <Flex
    bg="whitesmoke"
    p={3}
    mt={1}
    alignItems="center"
    borderRadius="0 0 6px 6px"
    style={{
      cursor: 'pointer'
    }}
    {...p}
  />
)

const CopyIcon = ({ hovered, ...p }) => (
  <Box pr={1} style={{ transform: 'translateY(2px)' }} {...p}>
    <ContentCopyIcon
      color={`rgba(0,0,0,${hovered ? 1 : 0.25})`}
      size={'1rem'}
    />
  </Box>
)

const CopyText = ({ copied, hovered, ...p }) => (
  <Type.small color={`rgba(0,0,0,${hovered ? 1 : 0.5})`}>
    {copied ? 'Copied to clipboard!' : 'Copy all words'}
  </Type.small>
)

const CopyAction = ({ seed, copy, copied, ...p }) => (
  <Hover>
    {({ hovered, bind }) => (
      <CopyToClipboard text={seed} onCopy={() => copy()}>
        <CopyButton {...bind}>
          <CopyIcon hovered={hovered} />
          <CopyText hovered={hovered} copied={copied} />
        </CopyButton>
      </CopyToClipboard>
    )}
  </Hover>
)
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
    const { next, seed, seedString, ...rest } = this.props
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
            <WordBox seed={seed} />
            <CopyAction
              copied={this.state.copied}
              copy={() => this.copy()}
              seed={seedString}
            />
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
