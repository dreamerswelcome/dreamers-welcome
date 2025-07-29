import React, { useEffect } from 'react'
import { Content } from '../../styles/global'
import Block from '../../_components/UI/Block'
import CollapsableList from '../../_components/UI/CollapsableList'
import Dropdown from '../../_components/UI/Dropdown'
import { getFaq, getFaqPage, getFaqs } from '../../_lib/api'
import Blurb from '../../_components/UI/Blurb'
import Head from 'next/head'

const Faq = ({ faq, dropdownData, faqPage, setNavTheme, seoData }: any) => {
    const { list } = faq

    useEffect(() => {
        setNavTheme('dark')
    }, [])

    return (
        <>
         <Head>
            <title>{seoData.metaTitle}</title>
            <meta name="description" content={seoData.metaDescription} />
            <link rel="canonical" href={seoData.canonicalUrl}/>
        </Head>
        <Content padding>
            <Blurb text={faqPage.blurb} eyebrow="FAQs" />
            <Block
                titleOverride={
                    <Dropdown
                        dark
                        id="faq-dropdown"
                        links={dropdownData}
                        bucket={faq.title}
                        defaultLabel="CHOOSE STAY"
                    />
                }
                content={<CollapsableList data={list} />}
            />
        </Content>
        </>
    )
}

export default Faq

export async function getStaticProps(context: { params: { slug: string } }) {
    const faq = await getFaq(context.params.slug)
    const faqsResponse = await getFaqs()
    const faqPage = await getFaqPage()
    const seoData = faqPage?.seoMetadata?.fields

    const faqGeneral = faqsResponse.filter((x) => x.slug == 'general')
    let faqs = faqsResponse.filter((x) => x.slug !== 'general')
    faqs = [...faqGeneral, ...faqs]

    let dropdownData: { label: string; slug: string }[] = faqs.map(
        (x: { title: string; slug: string }) => {
            return {
                label: x.title,
                slug: `faq/${x.slug}`,
            }
        }
    )

    return {
        props: {
            faq,
            dropdownData,
            faqPage,
            seoData: {
                metaTitle:
                  seoData?.metaTitle ?? 'Frequently Asked Questions | Dreamers Welcome',
                metaDescription: seoData?.metaDescription ?? "Browse through frequently asked questions of all the Dreamers Welcome properties that provide you will all the information at a glance.",
                canonicalUrl: seoData?.canonicalUrl ?? 'https://dreamerswelcome.com/faq/general',
            }
        },
    }
}

export async function getStaticPaths() {
    const faqs = await getFaqs()
    const paths: any = []
    faqs.forEach((x: { slug: string }) => {
        paths.push({ params: { slug: x.slug } })
    })
    return {
        // @ts-ignore
        paths: paths,
        fallback: false,
    }
}
