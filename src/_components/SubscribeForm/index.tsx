import React, { useEffect, useState } from 'react'
import InputField from '../UI/InputField'
import styled from 'styled-components'
import { rem } from 'polished'
import toast, { Toaster } from 'react-hot-toast'
import EmailCapture from '../EmailCapture'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const StyledButtonInput = styled(InputField)`
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
    position: relative;
    top: 2px;

    path {
      fill: #1a1a1a;
    }
  }

  &:disabled {
    svg {
      path {
        fill: #c1c1c1;
      }
    }
  }
`

const Form = styled.form`
  width: 100%;
  max-width: ${rem(800)};
  margin: 0 auto;

  > div {
    position: relative;
    width: 100%;
  }
`

const SubscribeForm = ({
  marginTop,
  status,
  message,
  onValidated,
  setIsEmailSubscribed,
  setisCompleted,
}: any) => {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('') // raw numeric from PhoneInput
  console.log(phone,"phone");
  
  const [phonePlaceholder, setPhonePlaceholder] = useState('Enter your mobile number')
  const [isEmailSubscribedIn, setIsEmailSubscribedIn] = useState(false)
  const [storeEmail, setStoreEmail] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [complete, setcomplete] = useState(false)
  const [holdError, setHoldError] = useState('')

  // Helper: numeric-only phone and validity
  const numericPhone = String(phone ?? '').replace(/\D/g, '')
  // adjust min length as per requirement (10 for local, 11 incl. country, etc.)
  const isPhoneValid = numericPhone.length >= 10

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setHoldError('')

    if (email === 'test@gmail.com') {
      return setHoldError(
        'This email cannot be added to this list. Please enter a different email address.'
      )
    }

    // Only enforce email validity on the first step
    if (!isEmailSubscribedIn && !isValid) return

    const sanitizedPhone = numericPhone // already stripped

    const payload: any = {
      EMAIL: email,
    }

    if (sanitizedPhone) {
      payload.SMSPHONE = `+${sanitizedPhone}`
    }

    onValidated(payload)

    if (sanitizedPhone) {
      setcomplete(true)
    } else {
      setStoreEmail(email)
    }
  }

  useEffect(() => {
    if (status === 'error') {
      if (message === 'There was an error, please try again later') {
        setHoldError('Network issue.')
      } else if (message === 'An unexpected error occurred during sms opt-in') {
        setHoldError('Check your number is correct?')
      } else {
        function formatErrorMessage(message: string): string {
          const capitalizedMessage = message.charAt(0).toUpperCase() + message.slice(1)
          const formattedMessage =
            capitalizedMessage.endsWith('.') || capitalizedMessage.endsWith('?')
              ? capitalizedMessage
              : capitalizedMessage + '.'
          return formattedMessage
        }

        const errorMessage: string = message
        const formattedErrorMessage: string = formatErrorMessage(errorMessage)
        setHoldError(formattedErrorMessage)
      }
    }
  }, [status, message])

  useEffect(() => {
    console.log('status---', status)
    if (status === 'success') {
      if (isEmailSubscribedIn === true) {
        if (complete === true) {
          setisCompleted(true)
          setIsEmailSubscribed(false)
        }
      }
      setIsEmailSubscribedIn(true)
      setIsEmailSubscribed(true)
    }
  }, [message, status, complete, isEmailSubscribedIn, setIsEmailSubscribed, setisCompleted])

  const handleEmailValidityChange = (isValid: boolean) => {
    setIsValid(isValid)
  }

  const handleChange = (value: string) => {
    setEmail(value)
    setHoldError('')
  }

  // Now this is wired to PhoneInput
  const handleChange2 = (value: string) => {
    setHoldError('')
    // value from react-phone-input-2 is already numeric (no "+")
    setPhone(value)
  }

  return (
    <>
      {isEmailSubscribedIn === false ? (
        <Form
          style={{ ['margin-top' as any]: marginTop }}
          onSubmit={handleSubmit}
          className="subscribe"
        >
          <div className="newsletter_wrapper">
            <div className="mobile_input">
              <InputField
                type="email"
                value={email}
                onChangeHandler={handleChange}
                placeholder="Enter your email"
                isRequired={true}
                name="email"
                onValidityChange={handleEmailValidityChange}
                errohandler={holdError}
              />
            </div>

            <div className="submit_btn">
              <StyledButtonInput type="submit" formValues={[email]} label={'Submit'} />
            </div>
          </div>
        </Form>
      ) : (
        <Form
          style={{ ['margin-top' as any]: marginTop }}
          onSubmit={handleSubmit}
          className="subscribe"
        >
          <div className="newsletter_wrapper">
            <div className="mobile_input">
              <PhoneInput
                country={'us'} // set default country as needed
                value={phone}
                onChange={handleChange2}
                placeholder={phonePlaceholder}
                inputProps={{
                  name: 'phone',
                  required: true,
                }}
                // you can tweak these for your UI:
                // enableAreaCodes={true}
                // countryCodeEditable={false}
              />
              {holdError && <p className="error_container">{holdError}</p>}
            </div>
            <div className="submit_btn">
              <button
                type="submit"
                className="submit_btn"
                disabled={!isPhoneValid} // 🔒 disable until valid numeric length
              >
                SUBMIT
              </button>
            </div>
          </div>
        </Form>
      )}
      <Toaster position="top-right" />
    </>
  )
}

export default SubscribeForm
