import React from 'react'
import { useDispatch } from 'react-redux'
import { Box, Text, Input, Button } from '@blockstack/ui'
import { doAuthRequest } from '@store/permissions/actions'
import { openPopup } from '../../actions/utils'
import { Formik } from 'formik'

const DevActions = () => {
  const dispatch = useDispatch()

  const saveAuthRequest = (authRequest: string) => {
    dispatch(doAuthRequest(authRequest))
    openPopup('http://localhost:8080/actions.html')
  }

  return (
    <Box width="100%">
      <Text textStyle="display.small" display="block">
        Dev Console
      </Text>
      <Text my={4} display="block">
        Mimic an authentication request by entering an <code>`authRequest`</code> below.
      </Text>
      <Formik
        initialValues={{ authRequest: '' }}
        onSubmit={values => {
          console.log(values)
          saveAuthRequest(values.authRequest)
        }}
      >
        {({ handleChange, values, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Input type="text" value={values.authRequest} onChange={handleChange} textStyle="body.small" />
            <Button mt={4}>Submit</Button>
          </form>
        )}
      </Formik>
    </Box>
  )
}

export default DevActions
