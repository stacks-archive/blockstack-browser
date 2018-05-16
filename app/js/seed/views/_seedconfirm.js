import React from 'react'
import { ShellScreen, Type, Button, Buttons } from '@blockstack/ui'

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

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (
      !prevState.verified &&
      this.state[this.state.wordsToConfirm[0]] &&
      this.state[this.state.wordsToConfirm[1]]
    ) {
      this.props.setVerified()
      this.setState({
        verified: true
      })
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
    const { next, seed, setVerified, verified, ...rest } = this.props

    const renderWords = (words, action) => {
      return this.state.randomWords.map(word => (
        <Button
          label={word}
          key={word}
          onClick={() => action(word)}
          filled={this.state[word]}
        />
      ))
    }

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

export default SeedConfirm
