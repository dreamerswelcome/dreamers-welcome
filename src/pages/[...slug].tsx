import {
  getAllPropertiesForPaths,
  getProperty,
  getRestOfPropertyData,
} from '../_lib/api'
import Blurb from '../_components/UI/Blurb'
import Suite from '../_components/Suite'
import BannerContent from '../_components/UI/BannerContent'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  BannerGridImage,
  BlockListWrap,
  GridModule,
  SeeMore,
  StyledBlockForGrid,
} from '../styles/global'
import { ConceptTextContainer } from '../styles/about/styles'
import BodyText from '../_components/Typography/BodyText'
import Block from '../_components/UI/Block'
import Header from '../_components/Typography/Header'
import MarkdownModule from '../_components/Typography/MarkdownModule'
import dynamic from 'next/dynamic'
import NewsItem from '../_components/NewsItem'
import Map from '../_components/Map'
const ImageSliderWrapper = dynamic(() =>
  import('../_components/UI/Swiper/styles').then(
    (module) => module.ImageSliderWrapper
  )
)
import PropertyGridItem from '../_components/PropertyGridItem'
import LightBox from '../_components/LightBox'
import Link from 'next/link'
import { StyledButton } from '../styles/landing/styles'
import { bucketToPath } from '../_utils/Parsers'
import safeJsonStringify from 'safe-json-stringify'
import { viewportContext } from '../_utils/ViewportProvider'
import Head from 'next/head'
const CollapsableList = dynamic(
  () => import('../_components/UI/CollapsableList')
)

const Highlight = dynamic(() => import('../_components/Suite/Highlight'))
// @ts-ignore
const Carousel = dynamic(() => import('../_components/UI/Swiper/Carousel'))

const SubNavigation = dynamic(
  () => import('../_components/Navigation/SubNavigation')
)

interface PropertyProps {
  propertyResponse: any
  setHeaderData: any
  setNavTheme: any
  otherStays: any
  seoData: any
}

const Property = ({
  propertyResponse,
  setHeaderData,
  setNavTheme,
  seoData,
}: PropertyProps) => {
  const {
    address,
    bannerImage,
    mobileBannerImage,
    bannerHeader,
    bannerDescriptionList,
    bucket,
    bookNowLink,
    bottomBlurb,
    blurb,
    concept,
    features,
    location,
    mapUrl,
    propertyType,
    propertyName,
    rooms,
    slug,
    suites,
    thingsToKnow,
    tileImage,
  } = propertyResponse

  const router = useRouter()

  // console.log("suites---->>>>",suites)
 console.log("property name ----------",propertyName)
  const pType = propertyType[0]
  const showSubNav = pType === 'Suites' || pType === 'Hotel'
  const [activeView, setView] = useState(suites[0])
  const [activeSlug, setSlug] = useState()
  const [lightbox, toggleLightbox] = useState<boolean>(false)

  const [extraData, setExtraData] = useState<{
    otherStays: any
    carouselImages: any
    faq: any
    news: any
  } | null>(null)

  const breakpoint = useContext(viewportContext)

  useEffect(() => {
    setNavTheme('light')
  }, [])

  useEffect(() => {
    setHeaderData({
      bucket: bucket[0],
      property: propertyName,
    })
    setExtraData(null)
    const getExtraData = async () => {
      const rawData = await getRestOfPropertyData(slug)
      const stringData = safeJsonStringify(rawData)
      const data = JSON.parse(stringData)
      setExtraData(data)
    }
    getExtraData()
  }, [router.query])

  const getSubNavigationData = () => {
    if (pType === 'Suites') {
      return suites.map((x: { fields: any }) => {
        return { name: x?.fields?.name, slug: `${x?.fields?.slug}` }
      })
    } else if (pType === 'Hotel') {
      return [
        { name: 'Suites', slug: 'suites' },
        { name: 'Rooms', slug: 'rooms' },
      ]
    }
  }

  const getHotelView = (a = 'suites') => {
    return a === 'suites' ? suites : rooms
  }

  useEffect(() => {
    const a = router.query.slug as string[]
    let viewToShow: string | undefined
    if (Array.isArray(a) && a.length > 1) {
      viewToShow = a.pop()
    } else {
      // If type is Hotel show Suites as default route
      viewToShow = pType === 'Hotel' ? 'suites' : suites[0]?.fields?.slug
    }

    // set slug
    // @ts-ignore
    setSlug(viewToShow)

    let finalView

    if (pType === 'Hotel') {
      finalView = getHotelView(viewToShow)
    } else {
      finalView =
        suites &&
        suites.length &&
        suites.find((x: any) => x?.fields?.slug === viewToShow)
    }

    setView(finalView)
  }, [router.query])

  const policyLinks = {
    apt: {
      link: 'https://dreamerswelcome.com/apt',
      description:
        'Explore these luxurious 8 vacation rentals nestled just three blocks from the beach in Puerto Rico’s colorful Santurce.',
      title: 'APT by DW | Laidback Luxury Vacation Rentals in San Juan',
    },
    casa_frida: {
      link: 'https://dreamerswelcome.com/casa-frida',
      description:
        'Explore our laidback luxury vacation house rental in San Juan. This mid-century designed 3-bedroom home will fulfill your dream stay in Puerto Rico.',
      title:
        'Casa Frida by DW | Laidback Luxury Vacation House Rental in San Juan',
    },
    dada_jaja: {
      link: 'https://dreamerswelcome.com/dadajaja',
      description:
        'Explore our four avant-garde self-check-in, beachside apartments that’ll draw you back to buzzy Santurce every weekend.',
      title: 'DaDa JaJa by DW | Laidback Luxury Vacation Rentals in San Juan',
    },
    dreamcatcher: {
      link: 'https://dreamerswelcome.com/dreamcatcher',
      description:
        'Explore Dreamcatcher, a multi-award winning full-service boutique hotel just a block from the beach and ten minutes by car to historic Old San Juan, Puerto Rico.',
      title:
        'Dreamcatcher by DW | Boutique Vegetarian Hotel Located in San Juan',
    },
    dreamers: {
      link: 'https://dreamerswelcome.com/dreamers-nc',
      description:
        'Explore this boutique hotel in the center of historic downtown Wilmington, North Carolina.',
      title: 'Dreamers By DW | Boutique Hotel Located in Wilmington, NC',
    },
    drift_away: {
      link: 'https://dreamerswelcome.com/drift-away',
      description:
        'Explore this laidback luxury 3 bedroom 1 bath vacation house rental in Wilmington, North Carolina.',
      title:
        'Drift Away by DW | Laidback Luxury Vacation House Rental in Sunset Park',
    },
    duna: {
      link: 'https://dreamerswelcome.com/duna',
      description:
        'Explore our self check-in laidback luxury vacation rental apartments with a salt-water pool, spacious yard, unexpected florals and a brave design.',
      title:
        'Duna by DW | Laidback Luxury Vacation Rentals Located in San Juan',
    },
    mood_haus: {
      link: 'https://dreamerswelcome.com/moodhaus',
      description:
        'Four unique stays inspire with bold 70s design and retro-vintage details. These laidback luxury apartments feature outdoor terraces, full kitchens, and beach access.',
      title: 'Mood Haus by DW | Laidback Luxury Retro Apartments in San Juan',
    },
    noa: {
      link: 'https://dreamerswelcome.com/noa',
      description:
        'Three modern vintage-inspired self-check-in beachside apartments blend playful natural light and touches of tropical nostalgia to create extraordinary experiences.',
      title:
        'Noa by DW | Laidback Luxury Vacation Rental Apartments in San Juan',
    },
    paz: {
      link: 'https://dreamerswelcome.com/paz',
      description:
        'Oversized airy beachside studio lofts bring an urban attitude to the tropics while the floor-to-ceiling windows invite the outdoors inside, creating a vibrant and organic atmosphere.',
      title:
        'Paz by DW | Laidback Luxury Vacation Rental Apartments in San Juan',
    },
    rosa: {
      link: 'https://dreamerswelcome.com/rosa',
      description:
        'Stunning and eclectic designer lofts ooze ambiance and comfort, located in San Juan. Self-check-in apartments with spa-worthy outdoor baths.',
      title:
        'Rosa by DW | Laidback Luxury Vacation Rental Apartments in San Juan',
    },
    selva: {
      link: 'https://dreamerswelcome.com/selva',
      description:
        'Laid-back luxury sprawled between a saltwater pool and seven acres of El Yunque’s emerald rainforest.',
      title: 'Selva by DW | Laidback Luxury Vacation House Rental in Luqillo',
    },
    tropicalia: {
      link: 'https://dreamerswelcome.com/tropicalia',
      description:
        'Four elegant self-check-in apartments tucked between Santurce’s vibrant art scene and the beach.Enjoy your San Juan stay in luxury with private outdoor spaces and beachside views.',
      title:
        'Tropicalla by DW | Laidback Luxury Vacation Rental Apartment in Santurce',
    },
    verde: {
      link: 'https://dreamerswelcome.com/verde',
      description:
        'Four minimalist and vintage-styled self-check-in apartments with private outdoor spaces.',
      title:
        'Verde by DW | Laidback Luxury Vacation Rental Apartments in San Juan',
    },
    wald_haus: {
      link: 'https://dreamerswelcome.com/waldhaus',
      description:
        '4 bed · 3.5 bath Vacation house rental with ocean view nestled in Naguabo rainforest. ',
      title:
        'Wald Haus by DW | Laidback Luxury Vacation House Rental in Rainforest',
    },
    // maru:{
    //   link: 'https://www.dreamerswelcome.com/maru',
    //   description:
    //     'All guests staying at MARU have access to a bounty of experiences from yoga by the sea to waterfalls and snorkeling trails.',
    //   title:
    //     'All guests staying at MARU have access to a bounty of experiences from yoga by the sea to waterfalls and snorkeling trails.',
    // },
  }

  // Convert propertyName to lowercase and replace spaces with underscores to match the object keys
  const formattedPropertyName = propertyName.toLowerCase().replace(/\s/g, '_')
  const policyInfo = policyLinks[formattedPropertyName] || {
    link: '',
    description: '',
    title: '',
  }
  
  

  return (
    <>
      <Head>
        <title>{seoData?.metaTitle ?? policyInfo.title}</title>
        <meta
          name="description"
          content={seoData?.metaDescription ?? policyInfo.description}
        />
        <link
          rel="canonical"
          href={seoData?.canonicalUrl ?? policyInfo.link}
        />
        <meta
          property="og:title"
          content={seoData?.ogTitle ?? `${propertyName} by DW`}
        />
        <meta
          property="og:description"
          content={
            seoData?.ogDescription ??
            `${propertyType[0]} in ${location}, ${bucket[0]}`
          }
        />
        <meta
          property="og:image"
          content={`https:${
            seoData?.ogImage
              ? seoData?.ogImage?.fields?.file?.url
              : tileImage?.fields?.file.url
          }?w=700`}
        />
      </Head>
      <BannerGridImage
        imageObj={bannerImage}
        mobileImageObj={mobileBannerImage}
        border={false}
        borderRadius={false}
        fullHeight
      >
        <BannerContent
          headerText={bannerHeader}
          headerSubheader={`${
            propertyType[0] === 'Suites' ? 'Apartments+' : propertyType[0]
          } in ${location}`}
          description={bannerDescriptionList}
          bookNowLink={bookNowLink}
        />
      </BannerGridImage>
      {blurb && blurb.length && <Blurb text={blurb} className={`${slug === 'selva' && "selva_wrapper"}`} />}

      {/* button to navigate on virtual tour */}
      {slug === 'selva' && (
    <div className="virtual-tour-button">
        <Link href={`/${slug}-virtual-tour`}>
            <button className="cmn_btn virtual_tour">
                View our Space in Virtual Tour
            </button>
        </Link>
    </div>
)}  


      {concept && (
        <Block
          title="CONCEPT"
          content={
            <ConceptTextContainer>
              <BodyText size="xlg">{concept}</BodyText>
            </ConceptTextContainer>
          }
        />
      )}
      {showSubNav && (
        <SubNavigation
          activeSlug={activeSlug}
          queryArray={router.query.slug || []}
          data={getSubNavigationData()}
        />
      )}
      {/* Suites view for 'Suites' and House*/}
      <div id="anchor_view">
        {pType !== 'Hotel' ? (
          // Suites and Houses
          <Suite
            propertySlug={activeSlug || ''}
            data={activeView}
            hideFirstSeparator={showSubNav && suites.length > 1}
          />
        ) : (
          // Hotel
          activeView &&
          Array.isArray(activeView) &&
          activeView.map((x, i) => {
            const { name, blurb, images } = x?.fields
            return (
              <Highlight
                key={`${name}-${Math.random() * i}`}
                title={name}
                blurb={blurb}
                images={images}
                slug={activeSlug || ''}
                hideSeparator={i === 0}
              />
            )
          })
        )}
      </div>

      {extraData && extraData.carouselImages && (
        <Block
          noPaddingBottom
          fullWidth
          content={
            <ImageSliderWrapper>
              <Carousel
                toggle={toggleLightbox}
                items={extraData.carouselImages}
              />
            </ImageSliderWrapper>
          }
        />
      )}

      {features && (
        <Block
          noPaddingBottom
          title="FEATURES"
          content={
            breakpoint !== 'mobile' ? (
              <GridModule columns={features.length} sideScrollOnMobile={false}>
                {features &&
                  features.map((feature: any) => (
                    <BlockListWrap key={feature?.fields?.title}>
                      <Header size={4}>{feature?.fields?.title}</Header>
                      <MarkdownModule data={feature?.fields?.text} />
                    </BlockListWrap>
                  ))}
              </GridModule>
            ) : (
              <CollapsableList data={features} />
            )
          }
        />
      )}

      {thingsToKnow && (
        <Block
          title="THINGS TO KNOW"
          noPaddingBottom
          content={
            breakpoint !== 'mobile' ? (
              <GridModule
                columns={thingsToKnow.length}
                sideScrollOnMobile={false}
              >
                {thingsToKnow &&
                  thingsToKnow.map((thing: any) => (
                    <BlockListWrap key={thing?.fields?.title}>
                      <Header size={4}>{thing?.fields?.title}</Header>
                      <MarkdownModule data={thing?.fields?.text} />
                    </BlockListWrap>
                  ))}
              </GridModule>
            ) : (
              <CollapsableList data={thingsToKnow} />
            )
          }
        />
      )}

      {bottomBlurb && bottomBlurb.length && (
        <Blurb text={bottomBlurb} borderTop>
          <StyledButton href={`/experiences/${bucketToPath(bucket[0])}`}>
            EXPERIENCES
          </StyledButton>
        </Blurb>
      )}

      {mapUrl && <Map link={mapUrl} />}

      {address && (
        <Block
          title="INFO"
          noPaddingBottom
          content={<MarkdownModule data={address} />}
        />
      )}

      {extraData && extraData.faq && (
        <Block
          title="FAQs"
          noPaddingBottom
          content={
            <>
              <CollapsableList
                data={extraData?.faq?.fields?.list.slice(0, 5)}
              />
              {extraData?.faq?.fields?.list.length > 5 && (
                <SeeMore>
                  <Link href={`/faq/${extraData?.faq?.fields?.slug}`}>
                    SEE MORE
                  </Link>
                </SeeMore>
              )}
            </>
          }
        />
      )}
      {extraData && extraData.news && (
        <StyledBlockForGrid
          title="IN THE NEWS"
          fullWidth
          noPaddingBottom
          link="/news"
          content={
            <GridModule columns={extraData?.news.length} sideScrollOnMobile>
              {extraData.news.length &&
                extraData.news.map((x: any, i: number) => (
                  <NewsItem key={x.slug + i} newsObj={x?.fields} />
                ))}
            </GridModule>
          }
        />
      )}
      {extraData && extraData.otherStays && extraData.otherStays.length && (
        <StyledBlockForGrid
          title="OTHER STAYS"
          fullWidth
          noPaddingBottom
          content={
            <GridModule columns={4} sideScrollOnMobile>
              {extraData.otherStays.length &&
                extraData.otherStays.map((x: any, i: number) => (
                  <PropertyGridItem
                    collapsed
                    key={x?.fields?.propertySlug}
                    propertyObj={x?.fields}
                  />
                ))}
            </GridModule>
          }
        />
      )}

      {/* @ts-ignore*/}
      {extraData && extraData.carouselImages && lightbox && (
        <LightBox items={extraData.carouselImages} toggle={toggleLightbox} />
      )}
    </>
  )
}

export default Property

export async function getStaticProps(context: { params: { slug: string } }) {
  const rawData = await getProperty(context.params.slug[0])
  const stringData = safeJsonStringify(rawData)
  const propertyResponse = JSON.parse(stringData)
  const seoData = propertyResponse?.seoMetadata?.fields

  return {
    props: {
      propertyResponse,
      seoData: seoData ?? null,
    },
  }
}

export async function getStaticPaths() {
  const allProperties = await getAllPropertiesForPaths()
 

  // @ts-ignore
  let paths: { params: { slug: string[] } }[] = []

  // @ts-ignore
  allProperties.forEach((property) => {
    const propertyType = property.propertyType[0]
    const pathObj = { params: { slug: [property.slug] } }
    paths.push(pathObj)

    // Check for suite routes
    if (
      property.suites &&
      property.suites.length > 0 &&
      propertyType === 'Suites'
    ) {
      property.suites.map((y: { fields: { slug: string } }) => {
        const pathObj = {
          params: {
            slug: [property.slug, y?.fields?.slug],
          },
        }
        paths.push(pathObj)
      })
    } else if (propertyType === 'Hotel') {
      const addition = [
        {
          params: {
            slug: [property.slug, 'suites'],
          },
        },
        {
          params: {
            slug: [property.slug, 'rooms'],
          },
        },
      ]
      paths.push(...addition)
    }
  })

  return {
    // @ts-ignore
    paths: paths,
    fallback: false,
  }
}
