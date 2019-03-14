import React, { useState } from 'react'
import { Type, Box } from 'blockstack-ui'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import { Field } from '../../components/ui/containers/field'
import { Button } from '../../components/ui/containers/button'
import { connect, mapDispatchToProps, mapStateToProps } from './_helper'

const Name = ({ username, updateUsername }) => {
  const [loading, setLoading] = useState(false)

  const buttonClick = () => {
    setLoading(true)
    setTimeout(() => {
      browserHistory.push('/hawk/registered')
    }, 3000)
  }

  const buttonProps = {
    onClick: buttonClick
  }
  if (loading) {
    buttonProps.disabled = true
  }

  return (
    <Box width={1} textAlign="center">
      <Box width={[1, 4 / 5]} mx="auto">
        <Type fontSize={5} fontWeight="600" display="block">
          Say goodbye to accounts you don’t
          <em> actually </em>
          control.
          <br />
          Say hello to your new universal Blockstack ID.
        </Type>
        <Type fontSize={3} color="grey" mt={4}>
          Why trust in ruthless companies like Google and Facebook to control your
          digital identity and dictate how you can use it? 
          <br />
          <br />
          With Blockstack, you
          own a new identity that lives on the world’s most secure blockchain in a
          decentralized way that no single company can control. Your identity will
          live forever with you, no matter what companies – or even governments! –
          come and go.
        </Type>

        <Box width={[1, 1 / 2]} mx="auto" mt={5}>
          <Field
            mt={4}
            value={username}
            handleChange={evt => updateUsername(evt.target.value)}
            label="Blockstack ID"
            autoFocus
          />

          <Button mt={4} {...buttonProps} >
            {loading ? 'Loading...' : 'Register your ID'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

Name.propTypes = {
  username: PropTypes.string.isRequired,
  updateUsername: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Name)
