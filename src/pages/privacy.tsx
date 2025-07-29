import React, { useEffect } from 'react'
import { Content, PageContent } from '../styles/global'
import Block from '../_components/UI/Block'
import MarkdownModule from '../_components/Typography/MarkdownModule'
import { getPage } from '../_lib/api'
import Head from 'next/head'

const Privacy = ({ data, setNavTheme, seoData }: any) => {
  const { content } = data

  useEffect(() => {
    setNavTheme('dark')
  }, [])

  
  return (
    <>
      <Head>
        <title>{seoData.metaTitle}</title>
        <meta name="description" content={seoData.metaDescription} />
        <link rel="canonical" href={seoData.canonicalUrl} />
      </Head>
      <Content padding>
        {/* <nav className={'breadcrumbs'} aria-label="breadcrumbs"><ol className={'_2jvtI'}><li><a href="/">Home </a></li><li>{'>'}</li><li>Privacy</li></ol></nav> */}
        <Block
          hideSeparator
          title="Privacy"
          content={
            <PageContent>
              <MarkdownModule data={content} />
            </PageContent>
          }
        />
      </Content>
    </>
  )
}

export default Privacy

export async function getStaticProps(context: { params: { slug: string } }) {
  const data = await getPage('privacy')
  const seoData = data?.seoMetadata?.fields

  return {
    props: {
      data,
      seoData: {
        metaTitle: seoData?.metaTitle ?? 'Privacy Policy | Dreamers Welcome',
        metaDescription:
          seoData?.metaDescription ??
          'Learn about the Privacy Policy at Dreamers Welcome and how we protect and handle your personal data when you visit our website.',
        canonicalUrl:
          seoData?.canonicalUrl ?? 'https://dreamerswelcome.com/privacy',
      },
    },
  }
}