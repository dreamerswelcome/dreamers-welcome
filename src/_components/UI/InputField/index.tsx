import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { BREAKPOINTS } from '../../../_constants/brekpoints';

const StyledInput = styled.input<{ invalid: boolean }>`
    border-radius: ${rem(40)};
    height: ${rem(50)};
    width: 100%;
    outline: none;
    box-shadow: none;
    border: ${({ invalid }) => (invalid ? '1px solid red' : '1px solid #c1c1c1')};
    padding: ${rem(20)};
    font-size: ${rem(18)};
    @media (max-width: ${BREAKPOINTS.TABLET}) {
        font-size: 13px;
    }
`;

const StyledButton = styled.button`
    border: none;
    background: none;
    outline: none;
`;


const ErrorText = styled.p`
    color: red; 
`;

const InputField = ({
    className,
    label,
    type,
    onChangeHandler,
    value,
    isRequired,
    name,
    formValues,
    placeholder,
    maxLength,
    onValidityChange,
    errohandler 
}: any) => {
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        onValidityChange && onValidityChange(isValid); 
    }, [isValid, onValidityChange]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        onChangeHandler(inputValue);

        if (type === 'email') {
            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            setIsValid(inputValue === '' || emailRegex.test(inputValue));
        }
    };

    const validateInput = (values: any) => {
        if (
            values.some((f: any) => f === '') ||
            values[0].indexOf('@') === -1
        ) {
            return true;
        } else {
            return false;
        }
    };

    //    console.log("is valid in hte input ---",isValid)

    if (type === 'submit') {
        return (
            <StyledButton
                className={className}
                type="submit"
                disabled={validateInput(formValues)}
            >
                {label}
            </StyledButton>
        );
    } else if (type === 'textarea') {
        return (
            <label>
                {label}
                <textarea
                    onChange={(e) => onChangeHandler(e.target.value)}
                    placeholder={placeholder}
                    value={value}
                    required={isRequired}
                    className="inputField__field"
                    rows={7}
                    name={name}
                />
            </label>
        );
    } else {
        return (
            <label>
                
                {label && label}
                <StyledInput
                    type={type}
                    onChange={handleChange}
                    value={value}
                    required={isRequired}
                    name={name}
                    placeholder={placeholder}
                    // maxLength={maxLength}
                    invalid={type === 'email' && !isValid}
                />
                {type === 'email' && !isValid && <ErrorText> Please enter a valid email address.</ErrorText>}
                { errohandler && <ErrorText> {errohandler}</ErrorText>}
            </label>
        );
    }
};

export default React.memo(InputField);
