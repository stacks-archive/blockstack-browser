import React from 'react'
import { ShellScreen, Type, Button, Buttons } from '@blockstack/ui'
import PropTypes from 'prop-types'

function getRandomInt(min, max, exclude) {
  min = Math.ceil(min)
  max = Math.floor(max)
  const randomNumber = Math.floor(Math.random() * (max - min)) + min
  if (exclude === randomNumber) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  return randomNumber
}

class SeedConfirm extends React.Component {
  generateNumbers = () => {
    const firstNumber = getRandomInt(0, 11)
    const secondNumber = getRandomInt(0, 11, firstNumber)

    this.setState({
      indexesToConfirm: [firstNumber, secondNumber],
      wordsToConfirm: [
        this.props.seed[firstNumber],
        this.props.seed[secondNumber]
      ]
    })
  }

  state = {
    indexesToConfirm: [],
    wordsToConfirm: [],
    selectedWords: [],
    words: {},
    confirmedWords: [],
    randomWords: [],
    verified: false,
    loading: false,
    error: false
  }

  componentWillMount() {
    if (!this.state.indexesToConfirm.length) {
      this.generateNumbers()
    }
    if (!this.state.randomWords.length) {
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
    if (!this.state.indexesToConfirm.length) {
      this.generateNumbers()
    }
    if (!this.state.randomWords.length) {
      this.randomWords()
    }
  }

  handleWordClick = word => {
    if (this.state.selectedWords.length < 2) {
      this.setState(
        state => ({
          ...state,
          words: { ...state.words, [word]: true },
          selectedWords: [...state.selectedWords, word]
        }),
        () => {
          if (this.state.wordsToConfirm.find(w => w === word)) {
            this.validWord(word)
          }
        }
      )
    }
  }

  resetState = () => {
    this.setState({
      indexesToConfirm: [],
      wordsToConfirm: [],
      selectedWords: [],
      confirmedWords: [],
      randomWords: [],
      words: {},
      verified: false,
      loading: false,
      error: true
    })
  }

  handleSubmit = () => {
    this.setState({ loading: true }, () =>
      setTimeout(() => {
        if (this.state.confirmedWords.length !== 2) {
          this.resetState()
        } else {
          this.props.next()
          this.props.setVerified()
          this.setState({
            loading: false
          })
        }
      }, 1500)
    )
  }

  validWord = word => {
    this.setState(state => ({
      confirmedWords: [...state.confirmedWords, word]
    }))
  }

  randomWords = () => {
    const { seed } = this.props
    const randomWords = [...seed].sort(() => 0.5 - Math.random())
    if (!this.state.randomWords.length) {
      this.setState({
        randomWords
      })
    }
  }
  render() {
    const { seed, ...rest } = this.props
    if (!seed || !this.state.randomWords.length) {
      return null
    }
    const renderWords = (words, action) =>
      this.state.randomWords.map(word => (
        <Button
          label={word}
          key={word}
          onClick={() => action(word)}
          filled={this.state.words[word]}
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
            <Type.h3>
              Select words #{this.state.indexesToConfirm[0] + 1} and #{this
                .state.indexesToConfirm[1] + 1}
            </Type.h3>
            <Buttons wrap>
              {renderWords(seed, w => this.handleWordClick(w))}
            </Buttons>
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
            label: this.state.error ? 'Try Again' : 'Confirm',
            primary: true,
            disabled: !this.state.selectedWords === 2,
            loading: this.state.loading,
            onClick: () => this.handleSubmit()
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
