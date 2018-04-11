import React, { Fragment } from 'react'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import styled from 'styled-components'
import { darken } from 'polished'
import { colors } from '@components/styled/theme'
import { space } from 'styled-system'
import { Button, ButtonLink, Buttons } from '@components/styled/Button'
import { FastField, Form, Formik } from 'formik'
import Yup from 'yup'

const Card = styled.div`
  border-radius: 8px;
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid ${darken(0.05, colors.grey[1])};
  background: white;
  ${space};
  * {
    text-align: left !important;
  }
  p {
    margin-bottom: 0;
    padding-bottom: 0;
  }

  & + & {
    margin-top: 20px;
  }
`

const validationSchema = Yup.object({
  seed: Yup.string().required('A recovery email is required.')
})

const Options = ({ previous, ...rest }) => (
  <PanelCard
    renderHeader={() => (
      <PanelCardHeader title="Enter your 12 Word Seed" pt={0} />
    )}
    {...rest}
  >
    <Fragment>
      <PanelCard.Section pt={2}>
        Please enter in your 12 word recovery seed.
      </PanelCard.Section>
      <PanelCard.Section pt={4}>
        <Formik
          initialValues={{ seed: '' }}
          validationSchema={validationSchema}
          onSubmit={values => {
            console.log('seed', values.seed)
          }}
          validateOnBlur={false}
          validateOnChange={false}
          render={({ errors, touched }) => (
            <Form>
              <label htmlFor="email">Email</label>
              <FastField
                name="seed"
                type="text"
                placeholder="12 word seed phrase"
              />
              {errors.seed &&
                touched.seed && (
                  <PanelCard.Error icon={null} message={errors.seed} />
                )}
              <Buttons>
                <ButtonLink onClick={() => previous()} secondary>
                  Go Back
                </ButtonLink>
                <Button primary type="submit">
                  Continue
                </Button>
              </Buttons>
            </Form>
          )}
        />
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

Options.propTypes = {}

export default Options
