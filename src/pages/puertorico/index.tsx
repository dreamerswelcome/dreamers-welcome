import React, { useEffect, useState } from 'react'
import {
  BannerGridImage,
  GridModule,
  StyledBlockForGrid,
} from '../../styles/global'
import { getLandingpage } from '../../_lib/api'
import BannerContent from '../../_components/UI/BannerContent'
import Blurb from '../../_components/UI/Blurb'
import Block from '../../_components/UI/Block'
import { getHomepage, getStaysForHomepage } from '../../_lib/api'
import styled from 'styled-components'
import { rem } from 'polished'
import GuideItem from '../../_components/GuideItem'
import ExperienceItem from '../../_components/ExperienceItem'
import NewsItem from '../../_components/NewsItem'
import safeJsonStringify from 'safe-json-stringify'
import dynamic from 'next/dynamic'
import PropertyGridItem from '../../_components/PropertyGridItem'
import Head from 'next/head'
const StyledBlurb = dynamic(() => 
  import('../../styles/landing/styles').then((module) => module.StyledBlurb)
)
const StyledButton = dynamic(() =>
  import('../../styles/landing/styles').then((module) => module.StyledButton)
)
const ImageGridSlider = dynamic(() => import('../../_components/UI/Swiper'))

const StaysSwiperWrap = styled.div`
  overflow: hidden;
  width: 100%;
  margin-top: ${rem(20)};

  .swiper {
    overflow: visible;
    margin-left: ${rem(20)};
    position: relative;
    margin-right: ${rem(20)};
  }

  .swiper-slide {
    max-width: 30%;
    min-width: ${rem(370)};
  }

  .navigation-wrap {
    top: ${rem(-46)};
  }
`
const Index = ({ data,landing, setNavTheme, setHeaderData, seoData }: any) => {
  const {
    blurb,
    title,
    guides,
    experiences,
    coverImage,
    mobileCoverImage,
    news,
  } = data


  console.log("guides length ------",guides)
  console.log(landing,"landing")
  const [stays, setStays] = useState(null)
  console.log('here__')
  useEffect(() => {
    setNavTheme('light')

    const data = {
      bucket: 'Puerto Rico',
      simpleNav: false,
      property: '',
    }
    setHeaderData(data)
    localStorage.setItem('bucket', data.bucket)

    const getStays = async () => {
      const rawData = await getStaysForHomepage('puertorico')
      const stringData = safeJsonStringify(rawData)
      const data = JSON.parse(stringData)
      
      const { stays } = data
      setStays(stays)
    }
    getStays()
  }, [])

  return (
    <>
      <Head>
        <title>{seoData.metaTitle}</title>
        <meta name="description" content={seoData.metaDescription} />
        <link rel="canonical" href={seoData.canonicalUrl} />
      </Head>
      <BannerGridImage
        imageObj={coverImage}
        mobileImageObj={mobileCoverImage}
        border={false}
        borderRadius={false}
        fullHeight
        sizes={'100vw'}
      >
        <BannerContent headerText={"Dreamers Welcome - Luxury Vacation Rentals and Boutique Hotel in Puerto Rico"} />
      </BannerGridImage>
      <Blurb text={blurb} />

      {stays && (
        <Block
         className="stays_outer"
          title="OUR STAYS"
          fullWidth
          
          noPaddingBottom
          link="/stays/puertorico"
          content={
            <StaysSwiperWrap className="stays_grid puerto_grids">
              <GridModule columns={3}>
                {stays &&
                  stays.length &&
                  stays
                    .slice(0, 3)
                    .map((p: any) => (
                      <PropertyGridItem propertyObj={p.fields} />
                    ))}
              </GridModule>
            </StaysSwiperWrap>
          }
        />
      )}
{/*  */}  <StyledBlurb text={landing.blurb} eyebrow="DW GROUP" borderTop>
<StyledButton href="/about">READ MORE</StyledButton>
        </StyledBlurb>
      {guides && guides.length && (
        <StyledBlockForGrid
          title="GUIDEBOOKS"
          fullWidth
          noPaddingBottom
          link="/guidebooks/puertorico"
          content={
            <GridModule columns={guides.length} sideScrollOnMobile>
              {guides &&
                guides.length &&
                guides.map((guide: any) => <GuideItem data={guide.fields} />)}
            </GridModule>
          }
        />
      )}

      {experiences && experiences.length && (
        <StyledBlockForGrid
          title="EXPERIENCES"
          fullWidth
          noPaddingBottom
          link="/experiences/puertorico"
          content={
            <GridModule columns={experiences.length} sideScrollOnMobile>
              {experiences &&
                experiences.length &&
                experiences.map((exp: any) => (
                  <ExperienceItem data={exp.fields} />
                ))}
            </GridModule>
          }
        />
      )}

      {news && news.length && (
        <StyledBlockForGrid
          title="IN THE NEWS"
          fullWidth
          noPaddingBottom
          link="/news"
          content={
            <GridModule columns={news.length} sideScrollOnMobile>
              {news.length &&
                news.map((x: any, i: number) => (
                  <NewsItem key={x.slug + i} newsObj={x?.fields} />
                ))}
            </GridModule>
          }
        />
      )}
    </>
  )
}

export default Index

export async function getStaticProps() {
  const rawData = await getHomepage('puertorico')
 
   const landing = await getLandingpage()
   
  const stringData = safeJsonStringify(rawData)
  const data = JSON.parse(stringData)
  console.log("final test---",data)
  const seoData = data?.seoMetadata?.fields


  return {
    props: {
      landing,
      data,
      seoData: {
        metaTitle:
          seoData?.metaTitle ??
          'Laidback Luxury Vacation Rentals & Boutique Hotel in Puerto Rico | DW',  
        metaDescription:
          seoData?.metaDescription ??
          "Puerto Rico's sunniest rental homes, apartments, and a design-forward boutique hotel that rivals all your rosiest tropical dreams.",
        canonicalUrl:
          seoData?.canonicalUrl ?? 'https://dreamerswelcome.com/puertorico',
          
      },
    },
  }
}

