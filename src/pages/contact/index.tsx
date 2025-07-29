import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Content } from '../../styles/global'
import {
    getAllProperties,
    getAllPropertiesForPaths,
    getProperty,
} from '../../_lib/api'
import Header from '../../_components/Typography/Header'
import {
    FormContainer,
    StyledInput,
    StyledSelect,
    StyledTextarea,
    StyledSelectWrapper,
    StyledSuccessBodyText,
} from '../../styles/contact/styles'
import Chevron from '../../_components/UI/Icons/Chevron'
import safeJsonStringify from 'safe-json-stringify'
import { sendConversionEvent } from '../api/fbConversionApi';
import Head from  'next/head'

async function generateSHA256Hash(input: string): Promise<string> {
    let hash = '';
    const charCodeArray = new TextEncoder().encode(input);

    const buffer = charCodeArray.reduce((buffer, byte) => {
        buffer.push(byte);
        return buffer;
    }, [] as number[]);

    const cryptoSubtle = window.crypto.subtle;
    if (cryptoSubtle) {
        const hashBuffer = await cryptoSubtle.digest('SHA-256', new Uint8Array(buffer));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hash = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    } else {
        throw new Error('SHA-256 hashing is not supported in this environment.');
    }

    return hash;
}

const Contact = ({ properties, setNavTheme, setHeaderData, seoData }: any) => {
    useEffect(() => {
        setNavTheme('dark')
        setHeaderData({
            simpleNav: false,
            property: undefined,
        })
    }, [])

    const [inProgress, setInProgress] = useState(false)

    const [submitted, setSubmitted] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const _handleSubmit = (data: any) => {
        if (inProgress) {
            return
        }
        setInProgress(true)
        if (!data.subject.length) {
            data.subject = 'OTHER'
        }

        if (!data.property.length) {
            data.property = 'GENERAL PROPERTY'
        }

        if (data.property !== 'GENERAL PROPERTY') {
            const propertyObj = properties.find((x: any) => x.propertyName.toUpperCase() == data.property.toUpperCase());
            data.bucket = propertyObj?.bucket[0].toUpperCase()
        } else {
            data.bucket = 'DESTINATION N/A'
        }
        generateSHA256Hash(JSON.stringify(data.email)).then((hashedEmail) => {
            const contactEvent = {
                event_name: 'Contact',
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                event_source_url: 'https://dreamerswelcome.com/contact',
                event_id: 'contact',
                user_data: {
                    em: [hashedEmail],
                    client_user_agent: navigator.userAgent,
                    ph: []
                },
                custom_data: {
                    name: data.name,
                    property: data.property,
                    subject: data.subject,
                    message: data.message,
                    test_event_code: 'TEST48544'
                }
            };
            sendConversionEvent(contactEvent);
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),

            }).then((res) => {
            
                if (res.status === 200) {
                    window.scrollTo({
                        behavior: 'smooth',
                        top: 0,
                    })
                    setInProgress(false)
                    setSubmitted(true)
                } else {
                    setInProgress(false)
                }
            })
        })
            .catch((error) => {
                console.error(error);
            });
    }

    // @ts-ignore
    return (
        <>    
        <Head>
            <title>{seoData.metaTitle}</title>
            <meta name="description" content={seoData.metaDescription} />
            <link rel="canonical" href={seoData.canonicalUrl}/>
        </Head>
        <Content padding>
            <div style={{ margin: '0 15px' }}>
                {!submitted ? (
                    <FormContainer>
                        <Header size={4}>CONTACT</Header>
                        <Header size={2}>Get in touch with us!</Header>
                        <form
                            onSubmit={handleSubmit((data) =>
                                _handleSubmit(data)
                            )}
                        >
                            <StyledInput
                                {...register('name', { required: true })}
                                placeholder="FULL NAME"
                            />
                            {errors.name && <p>Please enter your full name.</p>}
                            <StyledInput
                                placeholder="EMAIL"
                                type="email"
                                {...register('email', { required: true })}
                            />
                            {errors.email && (
                                <p>Please enter an email format.</p>
                            )}
                            <StyledSelectWrapper>
                                <StyledSelect
                                    {...register('subject', {
                                        required: false,
                                    })}
                                >
                                    <option value="" disabled selected>
                                        SUBJECT
                                    </option>
                                    <option>GENERAL INQUIRIES</option>
                                    <option>PRESS & MEDIA</option>
                                    <option>BOOKINGS</option>
                                    <option>OTHER</option>
                                </StyledSelect>
                                <Chevron dark />
                            </StyledSelectWrapper>
                            <StyledSelectWrapper>
                                <StyledSelect
                                    {...register('property', {
                                        required: false,
                                    })}
                                >
                                    <>
                                        <option value="" disabled selected>
                                            SELECT PROPERTY
                                        </option>
                                        <option>GENERAL PROPERTY</option>
                                        {properties &&
                                            properties.length &&
                                            properties
                                            .filter((p: any) => p.propertyName !== "Dreamers")
                                            .map((p: any) => (
                                                <option>
                                                    {p.propertyName.toUpperCase()}{' '}
                                                    {/* {`(${p.bucket[0]})`} */}
                                                </option>
                                            ))}
                                    </>
                                </StyledSelect>
                                <Chevron dark />
                            </StyledSelectWrapper>
                            <StyledTextarea
                                {...register('message', { required: true })}
                                placeholder="MESSAGE"
                            />
                            {errors.message && <p>Please enter message.</p>}
                            <StyledInput
                                type="submit"
                                value="MESSAGE US"
                                disabled={
                                    Object.keys(errors).length || inProgress
                                }
                            />
                        </form>
                    </FormContainer>
                ) : (
                    <StyledSuccessBodyText size="xlg">
                        Thank you for contacting us! We will be in touch
                        shortly.
                    </StyledSuccessBodyText>
                )}
            </div>
        </Content>
        </>
    )
}

export default Contact

export async function getStaticProps() {
    const rawData = await getAllPropertiesForPaths()
    const stringData = safeJsonStringify(rawData)
    const properties = JSON.parse(stringData)
    const seoData = properties?.seoMetadata?.fields

    return {
        props: {
            properties,
            seoData: {
                metaTitle:
                  seoData?.metaTitle ?? 'Contact Us | Dreamers Welcome',
                metaDescription: seoData?.metaDescription ?? "Reach out to us for any queries or questions you may have relating to your next stay with Dreamers Welcome, by using the contact details provided.",
                canonicalUrl: seoData?.canonicalUrl ?? 'https://dreamerswelcome.com/contact',
            },
        },
    }
}
