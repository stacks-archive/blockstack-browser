import styled, { css, keyframes } from 'styled-components'
import { trans } from '@ui/common'
import { spacing } from '@ui/common/constants'
import { Form as FormikForm } from 'formik'

const shakeAnimation = keyframes`
  0% { transform: translateX(-10px); }
  16% { transform: translateX(8px); }
  33% { transform: translateX(-6px); }
  50% { transform: translateX(4px); }
  66% { transform: translateX(-2px); }
  83% { transform: translateX(1px); }
  100% { transform: translateX(0); }
`

const Input = styled.input`
  padding: 10px 0;
  margin-top: 5px;
  border: none;
  outline: none;
  width: 100%;
  color: rgba(39, 16, 51, 0.7);
  ${({ lowercase }) =>
    lowercase &&
    css`
      text-transform: lowercase !important;
    `};
`

const Textarea = styled.textarea`
  padding: 10px;
  outline: none;
  width: 100%;
  max-width: 100%;
  display: block;
  border: 1px solid rgba(39, 15, 52, 0.1);
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  box-sizing: border-box;
  resize: vertical;
  min-height: ${({ mh }) => (mh ? `${mh}px` : '48px')};
  margin-top: 5px;
  color: rgba(39, 16, 51, 0.7);
`

const InputWrapper = styled.div`
  position: relative;
`
const Bar = styled.div`
  height: 2px;
  width: 100%;
  position: absolute;
  bottom: 1px;
  background: rgba(39, 15, 52, 0.6);
  border-radius: 3px;
  ${trans};
  pointer-events: none;

  ${Input}:focus ~ &,
  ${Textarea}:focus ~ & {
    background: rgba(75, 190, 190, 1);
  }
`

const InputOverlay = styled.div`
  position: absolute;
  top: 15px;
  color: rgba(39, 15, 52, 0.4);
  right: 0;
  pointer-events: none;
  user-select: none;
`

const Label = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  padding-right: 10px;
  line-height: 1.4;
  transform: translate3d(0, 0, 0);
  transform-origin: center left;
  color: rgba(39, 15, 52);
  ${trans};

  /* default state */
  ${Input}:not(:focus) ~ &,
  ${Textarea}:not(:focus) ~ & {
    transform: translateY(15px);
    opacity: 0.4;
  }

  /* focus / content state */
  ${Input}:focus ~ &,
  ${Input}:not(:placeholder-shown) ~ &,
  ${Textarea}:focus ~ &,
  ${Textarea}:not(:placeholder-shown) ~ & {
    //transform: translateY(-17px) scale(0.85);
    font-weight: 500;
    opacity: 0;
  }

  ${Textarea}:not(:focus) ~ & {
    transform: translateY(10px) translateX(10px);
  }
  ${Textarea}:focus ~ &,
  ${Textarea}:not(:placeholder-shown) ~ & {
    transform: translateY(-24px) scale(0.85) translateX(0);
  }
`

const HelperMessage = styled.div`
  font-style: normal;
  font-weight: 500;
  line-height: 23px;
  font-size: 14px;
  padding-top: 8px;
  color: rgba(39, 15, 52, 0.7);
`
const Group = styled.div`
  position: relative;
  ${({ error }) =>
    error &&
    css`
      ${InputWrapper} {
        animation: 0.6s ${shakeAnimation} ease;
      }
      ${Bar} {
        background: #f67b7b !important;
      }
    `};

  ${({ positive }) =>
    positive &&
    css`
      ${Bar} {
        background: mediumseagreen !important;
      }
    `};
`
const ErrorMessage = styled.div`
  color: #f67b7b;
  position: absolute;
  font-size: 12px;
  font-weight: 500;
  left: 0;
  top: -5px !important;

  ${Input}:not(:focus) ~ &,
  ${Textarea}:not(:focus) ~ & {
    top: 10px;
    ${({ overlay }) =>
      overlay &&
      css`
        top: -15px;
      `};
  }
  ${Textarea}:not(:focus) ~ & {
    right: 10px;
  }
  ${Input}:focus ~ &,
  ${Input}:not(:placeholder-shown) ~ &,
  ${Textarea}:focus ~ &,
  ${Textarea}:not(:placeholder-shown) ~ & {
    top: -15px;
    font-size: 12px;
    font-weight: 500;
  }
  ${Textarea}:focus ~ &,
  ${Textarea}:not(:placeholder-shown) ~ & {
    top: -22px;
  }
  ${trans};
`

const PositiveMessage = styled.div`
  color: mediumseagreen;
  position: absolute;
  left: 0;
  top: -5px !important;
  font-size: 12px;
  font-weight: 500;
  ${Input}:not(:focus) ~ &,
  ${Textarea}:not(:focus) ~ & {
    top: 10px;
    ${({ overlay }) =>
      overlay &&
      css`
        top: -15px;
      `};
  }
  ${Textarea}:not(:focus) ~ & {
    right: 10px;
  }
  ${Input}:focus ~ &,
  ${Input}:not(:placeholder-shown) ~ &,
  ${Textarea}:focus ~ &,
  ${Textarea}:not(:placeholder-shown) ~ & {
    top: -15px;
    font-size: 12px;
    font-weight: 500;
  }
  ${Textarea}:focus ~ &,
  ${Textarea}:not(:placeholder-shown) ~ & {
    top: -22px;
  }
  ${trans};
`
const LabelIcon = styled.div`
  margin-left: 5px;

  svg {
    display: block;
    * {
      fill: #f67b7b;
    }
  }
  ${({ positive }) =>
    positive &&
    css`
      svg {
        display: block;
        * {
          fill: mediumseagreen !important;
        }
      }
    `};
`

const StyledField = styled.div.attrs({
  autoComplete: 'new-password'
})``

const Form = styled(FormikForm).attrs({
  autoComplete: 'new-password'
})`
  ${Group} + ${Group} {
    margin-top: 10px;
  }
  * {
    ::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      color: transparent !important;
    }
    ::-moz-placeholder {
      /* Firefox 19+ */
      color: transparent !important;
    }
    :-ms-input-placeholder {
      /* IE 10+ */
      color: transparent !important;
    }
    :-moz-placeholder {
      /* Firefox 18- */
      color: transparent !important;
    }
  }

  & + p,
  & + h1,
  & + h2,
  & + h3 {
    margin-top: ${spacing.gutter};
  }
`
StyledField.Label = Label
StyledField.Label.Icon = LabelIcon
StyledField.Group = Group
StyledField.Input = Input
StyledField.Textarea = Textarea
StyledField.Input.Overlay = InputOverlay
StyledField.Input.Wrapper = InputWrapper
StyledField.Input.Bar = Bar
StyledField.Input.Message = HelperMessage
StyledField.Input.Error = ErrorMessage
StyledField.Input.Positive = PositiveMessage

export { Form, StyledField }
