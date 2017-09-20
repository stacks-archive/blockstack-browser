import React, { Component, PropTypes } from 'react'
import InputGroup from '../../components/InputGroup'

class ConfirmIdentityKeyView extends Component {
  static propTypes = {
    confirmIdentityKeyPhrase: PropTypes.func.isRequired,
    showPreviousView: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      submitEnabled: false,
      identityKeyPhrase: props.identityKeyPhrase,
      tappedWords: [],
      keyPhraseArrays:
      { reOrderedArray: props.identityKeyPhrase.split(' ').sort(),
        orderedArray: props.identityKeyPhrase.split(' '),
      }
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.confirmIdentityKeyPhraseSubmit = this.confirmIdentityKeyPhraseSubmit.bind(this)
    this.handleWordClick = this.handleWordClick.bind(this)
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  confirmIdentityKeyPhraseSubmit(event) {
    event.preventDefault()
    this.props.confirmIdentityKeyPhrase(this.state.tappedWords.join(' '))
  }

  resetKeyPhraseState(index) {
    let tappedWords = this.state.tappedWords.splice(index, 1);

    this.setState({tappedWords: tappedWords});
  }

  handleWordClick(event) {
    const word = event.currentTarget.textContent,
          tappedWords = this.state.tappedWords

    tappedWords.push(word)

    this.state.keyPhraseArrays.orderedArray.forEach((word, idx) => {
      if (idx < this.state.tappedWords.length) {
        if (this.state.tappedWords[idx] != this.state.keyPhraseArrays.orderedArray[idx]) {
          this.resetKeyPhraseState(idx);
        }
        this.setState({tappedWords: tappedWords});
      }
    })
  }

  render() {

    return (
      <div>
        <h3 className="modal-heading">
          Let&#39;s verify your identity key to confirm you&#39;ve kept it in a safe place
        </h3>
        <p className="modal-body">Tap each word your in the correct order:</p>
        <p className="tapped-identity-words">
            {this.state.tappedWords.map((tappedWord) => {
                return (
                  <span className="tapped-identity-word">{tappedWord}</span>
                )
            })}
        </p>
        <p className="identity-words-to-tap">
          {this.state.keyPhraseArrays.reOrderedArray.map((word) => {

            if (this.state.tappedWords.indexOf(word) > -1) {
              return (
                <span className="tapped-word-complete"></span>
              )
            }
            return (
              <button className="btn btn-primary btn-sm visible-word"
                      onClick={this.handleWordClick}>{word}</button>
            )
          })}
        </p>
        <form onSubmit={this.confirmIdentityKeyPhraseSubmit}>
          <InputGroup
            hidden={true}
            name="identityKeyPhrase"
            type="text"
            label="Identity key"
            placeholder="Identity key"
            data={this.state}
            onChange={this.onValueChange}
            required
          />
          <div style={{ marginBottom: '-20px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-block m-b-10"
              disabled={this.state.submitEnabled}
            >
              Continue
            </button>
            <p>
              <a href="#" className="modal-body" onClick={this.props.showPreviousView}>Back</a>
            </p>
          </div>
        </form>
      </div>
    )
  }
 }

export default ConfirmIdentityKeyView
