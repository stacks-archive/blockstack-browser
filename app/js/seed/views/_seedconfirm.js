import React from 'react'
import { ShellScreen, Type, Button, Buttons } from '@blockstack/ui'
import PropTypes from 'prop-types'
import { Box, Inline, Flex } from '@components/ui/components/primitives'
import { Trail, config, animated } from 'react-spring'

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
    const firstNumber = getRandomInt(0, 2)
    const secondNumber = getRandomInt(9, 11, firstNumber)

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
    if (this.state.selectedWords.length === 1) {
      setTimeout(() => this.handleSubmit(), 250)
    }
  }

  resetState = () => {
    this.setState(
      {
        error: true
      },
      () =>
        setTimeout(
          () =>
            this.setState({
              indexesToConfirm: [],
              wordsToConfirm: [],
              selectedWords: [],
              confirmedWords: [],
              randomWords: [],
              words: {},
              verified: false,
              loading: false,
              error: false
            }),
          800
        )
    )
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
      }, 150)
    )
  }

  validWord = word => {
    if (!this.state.confirmedWords.find(stateWord => stateWord === word)) {
      this.setState(state => ({
        confirmedWords: [...state.confirmedWords, word]
      }))
    }
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
    const renderWords = (words, action) => (
      <Trail
        native
        from={{ opacity: 0, y: -2 }}
        to={{ opacity: 1, y: 0 }}
        keys={this.state.randomWords}
        config={config.stiff}
      >
        {this.state.randomWords.map(word => ({ opacity, y }) => {
          const hasError = this.state.error
          const isSelected = this.state.words[word]
          const selectedColor = hasError ? '#f67b7b' : 'whitesmoke'
          const bgColor = isSelected ? selectedColor : 'transparent'

          return (
            <Box
              is={animated.div}
              style={{
                transition: '0.1s background ease-in-out',
                opacity,
                transform: y.interpolate(prop => `translate3d(0,${prop}px,0)`),
                cursor: 'pointer'
              }}
              width="calc(33.33333% - 10px)"
              key={word}
              onClick={() => action(word)}
              bg={bgColor}
              border="1px solid rgba(39, 16, 51, 0.2)"
              px={3}
              py={2}
              mb={3}
              textAlign="center"
              mr="10px"
              borderRadius="30px"
              fontSize="16px"
            >
              <Inline>{word}</Inline>
            </Box>
          )
        })}
      </Trail>
    )

    const props = {
      title: {
        children: (
          <>
            Select words #{this.state.indexesToConfirm[0] + 1} and #
            {this.state.indexesToConfirm[1] + 1}
          </>
        ),
        variant: 'h2'
      },
      content: {
        grow: 1,
        children: (
          <Box pt={3}>
            <Type.small>
              Blockstack cannot recover your key. We need to confirm you have
              saved it.
            </Type.small>
            <Flex pt={4} flexWrap="wrap">
              {renderWords(seed, w => this.handleWordClick(w))}
            </Flex>
          </Box>
        )
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
