import React from 'react'
import { ShellScreen, Type, Panel, Panels } from '@blockstack/ui'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import PropTypes from 'prop-types'

const renderWord = (i, word, condition = true) =>
  condition && (
    <div
      style={{ display: 'flex', alignItems: 'center', paddingBottom: '15px' }}
    >
      <Type.h5>#{i + 1}&nbsp;&nbsp;</Type.h5>
      <Type.h2 key={word}>{word}</Type.h2>
    </div>
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
    const { next, seed, ...rest } = this.props
    const props = {
      title: {
        children: 'Write down all words',
        variant: 'h1',
        subtitle: {
          light: true,
          children: 'Your Secret Recovery Key',
          padding: '10px 0 0 0'
        }
      },

      content: {
        grow: 1,
        children: (
          <Panels panels={2}>
            <Panel>
              {seed.map(
                (word, i) => renderWord(i, word, i % 2 === 0)
              )}
            </Panel>
            <Panel>
              {seed.map(
                (word, i) => renderWord(i, word, i % 2 !== 0)
              )}
            </Panel>
          </Panels>
        )
      },
      actions: {
        items: [
          {
            label: 'I have written down all words',
            primary: true,
            onClick: () => next()
          },
          {
            label: this.state.copied ? (
              'Copied!'
            ) : (
              <CopyToClipboard
                text={this.state.seed}
                onCopy={() => this.copy()}
              >
                <span>Copy 12 Words</span>
              </CopyToClipboard>
            )
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
