import React from 'react'
import { useDispatch } from 'react-redux'
import { Box, Text, Input, Button, ButtonGroup } from '@blockstack/ui'
import { doAuthRequest } from '@store/permissions/actions'
import { openPopup } from '../../actions/utils'
import { Formik } from 'formik'

const DevActions = () => {
  const dispatch = useDispatch()

  const saveAuthRequest = (authRequest: string) => {
    dispatch(doAuthRequest(authRequest))
    openPopup('http://localhost:8080/actions.html')
  }

  const openBrowserActions = () => {
    openPopup('http://localhost:8080/popup.html')
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
      <ButtonGroup variantColor="purple" my={4}>
        <Button onClick={openBrowserActions}>Debug Browser Action</Button>
      </ButtonGroup>
    </Box>
  )
}

export default DevActions
