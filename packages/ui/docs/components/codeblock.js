import React from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { CodeMirrorStylesContainer } from './codemirror'

import styled from 'styled-components'

const StyledCode = styled.code`
  padding: 18px 15px 20px
    ${({ lineNumbers }) => (lineNumbers ? '32px' : '14px')} !important;
  background-color: #263238 !important;
  color: rgba(233, 237, 237, 1);
  font-size: 16px !important;
  line-height: 24px !important;
  margin: 20px 0;
  border-radius: 0 !important;
  display: block !important;
  font-family: monospace !important;
`

const returnLanguage = (lang) => {
  switch (lang) {
    case 'bash':
      return 'shell'
    case 'json':
      return 'javascript'
    default:
      return lang
  }
}

class Codeblock extends React.PureComponent {
  instance = null
  state = {
    mounted: false
  }

  componentDidMount() {
    if (!this.state.mounted) {
      this.setState({
        mounted: true
      })
    }
    require('codemirror')
    require('codemirror/mode/css/css')
    require('codemirror/mode/shell/shell')
    require('codemirror/mode/jsx/jsx')
    require('codemirror/mode/javascript/javascript')
  }

  render() {
    if (!this.props.children) {
      return null
    }
    const language = this.props.className && this.props.className.split('-')[1]

    return (
      <CodeMirrorStylesContainer>
        {this.state.mounted ? (
          <CodeMirror
            editorDidMount={(editor) => {
              this.instance = editor
            }}
            value={this.props.children.trimRight()}
            className={language === 'bash' ? 'no-line-numbers' : null}
            options={{
              mode: returnLanguage(language),
              theme: 'material',
              lineNumbers: language !== 'bash'
            }}
          />
        ) : (
          <StyledCode lineNumbers={language !== 'bash'}>
            {this.props.children.trimRight()}
          </StyledCode>
        )}
      </CodeMirrorStylesContainer>
    )
  }
}

export { Codeblock }
