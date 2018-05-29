import React from 'react'
import { ShellScreen, Type, Button, Buttons } from '@blockstack/ui'
import PropTypes from 'prop-types'

class SeedConfirm extends React.Component {
  state = {
    wordsToConfirm: [this.props.seed[7], this.props.seed[2]],
    verified: false
  }

  componentWillMount() {
    if (!this.state.randomWords) {
      this.randomWords()
    }
  }

  setVerified = () => {
    if (!this.state.verified) {
      this.setState(
        {
          verified: true
        },
        () => this.props.setVerified()
      )
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      !prevState.verified &&
      this.state[this.state.wordsToConfirm[0]] &&
      this.state[this.state.wordsToConfirm[1]]
    ) {
      this.setVerified()
    }
  }

  checkWord = word => {
    if (this.state.wordsToConfirm.find(w => w === word)) {
      this.setState({
        [word]: true
      })
    }
  }

  randomWords = () => {
    const { seed } = this.props
    const randomWords = [...seed].sort(() => 0.5 - Math.random())
    if (!this.state.randomWords) {
      this.setState({
        randomWords
      })
    }
  }
  render() {
    const { next, seed, verified, ...rest } = this.props

    const renderWords = (words, action) =>
      this.state.randomWords.map(word => (
        <Button
          label={word}
          key={word}
          onClick={() => action(word)}
          filled={this.state[word]}
        />
      ))

    const props = {
      title: {
        children: (
          <React.Fragment>Verify your Secret Recovery&nbsp;Key</React.Fragment>
        ),
        variant: 'h2'
      },
      content: {
        grow: 1,
        children: (
          <React.Fragment>
            <Type.h3>Select words #1 and #8</Type.h3>
            <Buttons wrap>{renderWords(seed, w => this.checkWord(w))}</Buttons>
          </React.Fragment>
        )
      },
      actions: {
        split: true,
        items: [
          {
            label: ' ',
            textOnly: true
          },
          {
            label: 'Next',
            primary: true,
            icon: 'ArrowRightIcon',
            disabled: !verified,
            onClick: () => {
              next()
            }
          }
        ]
      }
    }
    return <ShellScreen {...rest} {...props} />
  }
}

SeedConfirm.propTypes = {
  next: PropTypes.func,
  setVerified: PropTypes.func,
  verified: PropTypes.bool,
  seed: PropTypes.array
}

export default SeedConfirm
