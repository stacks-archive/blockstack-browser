import React from 'react'
require('regenerator-runtime/runtime')
import { AuthPage } from '../../app/js/auth'

test('makes a component', async () => {
  const authPage = <AuthPage />
  console.log(authPage.props)
})
