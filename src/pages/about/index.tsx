import React, { useContext, useEffect } from 'react'
import {
  BannerGridImage,
  GridModule,
  Stat,
  StatsGridModule,
} from '../../styles/global'
import BannerContent from '../../_components/UI/BannerContent'
import Blurb from '../../_components/UI/Blurb'
import { getAbout } from '../../_lib/api'
import Block from '../../_components/UI/Block'
import Header from '../../_components/Typography/Header'
import BodyText from '../../_components/Typography/BodyText'
import GridImage from '../../_components/UI/GridImage'
import { NewsTextWrapper } from '../../_components/NewsItem/styles'
import { ConceptTextContainer, StaffMetadata } from '../../styles/about/styles'
import { parseMoneyOrTime } from '../../_utils/Parsers'
import { viewportContext } from '../../_utils/ViewportProvider'
import MarkdownModule from '../../_components/Typography/MarkdownModule'
import Head from 'next/head'

const About = ({ about, seoData, setHeaderData, setNavTheme }: any) => {
  const {
    bannerImage,
    bannerHeader,
    mobileBannerImage,
    blurb,
    concept,
    founders,
    ourReach,
  } = about

  const breakpoint = useContext(viewportContext)

  useEffect(() => {
    setNavTheme('light')
  }, [])

 
  return (
    <>
      <Head>
        <title>{seoData.metaTitle}</title>
        <meta name="description" content={seoData.metaDescription} />
        <link rel="canonical" href={seoData.canonicalUrl} />
      </Head>
      <BannerGridImage
        imageObj={bannerImage}
        mobileImageObj={mobileBannerImage}
        border={false}
        borderRadius={false}
        fullHeight
      >
        <BannerContent headerText={bannerHeader} />
      </BannerGridImage>
      <Blurb text={blurb} />
      <Block
        title="CONCEPT"
        content={
          <ConceptTextContainer>
            <MarkdownModule data={concept} />
          </ConceptTextContainer>
        }
      />
      <Block
        title="FOUNDERS"
        noPaddingBottom
        content={
          <GridModule columns={2} sideScrollOnMobile={false}>
            {founders &&
              founders.map((founder: any, i: number) => {
                return (
                  <div key={~~(Math.random() * i)}>
                    <GridImage
                      sizes={'33vw'}
                      imageObj={founder.fields.coverImage}
                      ratio={1}
                    />
                    <StaffMetadata>
                      <Header size={3}>{founder.fields.name}</Header>
                      <NewsTextWrapper>
                        <BodyText size="md">
                          {founder.fields.description}
                        </BodyText>
                      </NewsTextWrapper>
                    </StaffMetadata>
                  </div>
                )
              })}
          </GridModule>
        }
      />
      <Block
        title="BY THE NUMBERS"
        content={
          <StatsGridModule columns={4}>
            {ourReach &&
              ourReach.map((stat: any, i: number) => {
                const { title, text } = stat.fields
                return (
                  <div key={title}>
                    {breakpoint == 'mobile' && (
                      <BodyText size="md">{title}</BodyText>
                    )}
                    <Stat>{parseMoneyOrTime(text, 30)}</Stat>
                    {breakpoint !== 'mobile' && (
                      <BodyText size="md">{title}</BodyText>
                    )}
                  </div>
                )
              })}
          </StatsGridModule>
        }
      />
    </>
  )
}

export default About

export async function getStaticProps() {
  const about = await getAbout()
  const seoData = about?.seoMetadata?.fields

  return {
    props: {
      about,
      seoData: {
        metaTitle:
          seoData?.metaTitle ??
          'About Dreamers Welcome | Boutique Hotels & Laidback Luxury Vacation Rentals',
        metaDescription:
          seoData?.metaDescription ??
          'With over 60 laidback luxury vacation rentals stretching from Puerto Rico to North Carolina, Dreamers Welcome is an LGBTQIA-owned hospitality group with progressive amenities.',
        canonicalUrl:
          seoData?.canonicalUrl ?? 'https://dreamerswelcome.com/about',
      },
    },
  }
}
