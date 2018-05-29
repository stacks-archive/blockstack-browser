import React from 'react'
import PropTypes from 'prop-types'
import { ActionButtons } from '@components/ui/containers/button'
import { Form } from '@components/ui/components/form'
import { Field } from '@components/ui/containers/field'
import { Formik, FastField } from 'formik'

const Fields = ({ fields, errors, ...rest }) =>
  fields.map(({ label, name, placeholder, ...fieldProps }, i) => (
    <FastField
      label={label}
      name={name}
      render={fastFieldProps => (
        <Field
          key={i}
          label={label}
          name={name}
          {...fieldProps}
          {...fastFieldProps.field}
          {...rest}
          error={
            (fastFieldProps.meta.touched &&
              fastFieldProps.meta.error &&
              fastFieldProps.meta.error) ||
            (errors && errors[name])
          }
        />
      )}
    />
  ))

const FormWrapper = ({
  actions,
  fields,
  errors,
  touched,
  handleSubmit,
  handleChange,
  handleBlur
}) => {
  const fieldProps = {
    errors,
    touched,
    handleSubmit,
    handleChange,
    onBlur: handleBlur,
    handleBlur
  }
  return (
    <Form noValidate>
      <Fields fields={fields} {...fieldProps} />
      <ActionButtons {...actions} />
    </Form>
  )
}

const FormContainer = ({
  initialValues,
  validationSchema,
  onSubmit,
  validate,
  validateOnBlur = false,
  validateOnChange = false,
  ...rest
}) => {
  const props = validate
    ? {
        initialValues,
        onSubmit,
        validate,
        validateOnBlur,
        validateOnChange,
        ...rest
      }
    : {
        initialValues,
        validationSchema,
        onSubmit,
        validateOnBlur,
        validateOnChange,
        ...rest
      }
  return (
    <Formik {...props}>
      {renderProps => <FormWrapper {...renderProps} {...rest} />}
    </Formik>
  )
}

Fields.propTypes = {
  actions: PropTypes.array,
  fields: PropTypes.array,
  errors: PropTypes.object,
  touched: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func
}
FormWrapper.propTypes = {
  actions: PropTypes.array,
  fields: PropTypes.array,
  errors: PropTypes.object,
  touched: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func
}
FormContainer.propTypes = {
  initialValues: PropTypes.object,
  validationSchema: PropTypes.object,
  onSubmit: PropTypes.func,
  validate: PropTypes.func,
  validateOnBlur: PropTypes.bool,
  validateOnChange: PropTypes.bool
}
export { FormContainer }
