import React, { useContext, useEffect } from 'react'
import {
    BannerGridImage,
    BlockListWrap,
    GridModule,
    Stat,
    StatsGridModule,
    StyledBlockForGrid,
} from '../../styles/global'
import BannerContent from '../../_components/UI/BannerContent'
import { getExperience, getExperiences } from '../../_lib/api'
import Block from '../../_components/UI/Block'
import BodyText from '../../_components/Typography/BodyText'
import { ConceptTextContainer } from '../../styles/about/styles'
import Blurb from '../../_components/UI/Blurb'
import { bucketToPath, parseMoneyOrTime } from '../../_utils/Parsers'
import Header from '../../_components/Typography/Header'
import MarkdownModule from '../../_components/Typography/MarkdownModule'
import ExperienceItem from '../../_components/ExperienceItem'
import safeJsonStringify from 'safe-json-stringify'
import { viewportContext } from '../../_utils/ViewportProvider'
import CollapsableList from '../../_components/UI/CollapsableList'
import Head from 'next/head'

const Experience = ({ experience, setHeaderData, setNavTheme, seoData }: any) => {
    const {
        slug,
        bannerImage,
        mobileBannerImage,
        title,
        blurb,
        info,
        details,
        bookNowLink,
        thingsToKnow,
        bucket,
        otherExperiences,
        includedWithStay,
    } = experience

    const breakpoint = useContext(viewportContext)

    useEffect(() => {
      
        setNavTheme('light')
        setHeaderData({
            bucket: bucket[0],
        })
    }, [])
 


    const policyLinksObj = {
        "breakfast": {
            link: 'https://dreamerswelcome.com/experience/breakfast',
            description: 'Join us for our popular plant-based breakfast & brunch served everyday from 8 AM to 1 PM at Dreamcatcher by DW.',
            title:"Vegetarian Breakfast & Brunch | Dreamcatcher by DW "
        },
        "breakfastnc": {
            link: 'https://dreamerswelcome.com/experience/breakfastnc',
            description: 'Every morning, Dreamers by DW offers a complimentary vegan breakfast. Dishes are fresh, healthy, and ever-evolving with the creative whims of our talented chef.',
            title:"Complimentary Vegan Breakfast | Dreamers by DW"
        },
        "dinner":{
            link: 'https://dreamerswelcome.com/experience/dinner',
            description: 'Join us on a culinary journey every Friday from 6 PM to 9 PM at Dreamcatcher by DW and indulge in our inspired four-course prix fixe vegetarian and vegan dinners.',
            title:"Vegetarian Dinner | Dreamcatcher by DW"
        },
        "epicexcursionsnc":{
            link: 'https://dreamerswelcome.com/experience/epicexcursionsnc',
            description: 'Explore Epic Excursions with private boat charters, eco and dolphin boat tours, Masonboro Island and Lea Island tours, and much more.',
            title:"Epic North Carolina Excursions | Dreamers by DW"
        },
        "massages":{
            link: 'https://dreamerswelcome.com/experience/massages',
            description: 'Take advantage of our Swedish, Thai, and deep-tissue massage offerings via private or couple massage packages in San Juan.',
            title:"In-Room Private Massages in San Juan | Dreamers Welcome"
        },
        "massagesnc":{
            link: 'https://dreamerswelcome.com/experience/massagesnc',
            description: 'Explore our Swedish or deep-tissue private massages located in Wilmington, North Carolina.',
            title:"In-Room Private Massages in North Carolina | Dreamers Welcome"
        },
        "photo":{
            link: 'https://dreamerswelcome.com/experience/photo',
            description: 'Capture your picture-perfect vacation moments with Hector Javier, an international professional photographer.',
            title:"Private Photoshoot in San Juan | Dreamers Welcome"
        },
        "rainforest":{
            link: 'https://dreamerswelcome.com/experience/rainforest',
            description: 'Follow steep rainforest trails to majestic waterfalls, pristine rock slides and unbelievable views in a hiking excursion through Puerto Ricos El Yunque',
            title:"Rainforest Hiking in El Yunque, Puerto Rico | Dreamers Welcome"
        },
        "salsa":{
            link: 'https://dreamerswelcome.com/experience/salsa',
            description: 'This authentic, cultural, Latin dancing experience is perfect for couples or groups. Join us for dance lessons in San Juan.',
            title:"San Juan Salsa Lessons & Latin Dancing | Dreamers Welcome"
        },
        "snorkel":{
            link: 'https://dreamerswelcome.com/experience/snorkel',
            description: 'Take a guided snorkeling adventure in the coral reefs of Escambron. Rich with tiny seahorses, sea turtles, octopus, and tropical fish.',
            title:"San Juan Guided Snorkeling | Dreamers Welcome"
        },
        "spoon-tour":{
            link: 'https://dreamerswelcome.com/experience/spoon-tour',
            description: 'Take a food tour any day of the week with SPOON – a boutique, family-owned-and-operated business in Puerto Rico.',
            title:"Food Tour in San Juan | Dreamers Welcome"
        },
        "surfing":{
            link: 'https://dreamerswelcome.com/experience/surfing',
            description: 'Whether you are a complete beginner or an experienced rider looking to refine your skills, our expert instructors are here to guide you every step of the way.',
            title:"Surfing Lessons In San Juan | Dreamers Welcome"
        },
        "waterfall":{
            link: 'https://dreamerswelcome.com/experience/waterfall',
            description: 'A guided tour through the waterfalls of Gozalandia, less than two hours from San Juan, offering positive vibes, rope swings, secluded swimming holes, swimmable caves and more.',
            title:"Gozalandia Waterfall Tour | Dreamers Welcome"
        },
        "yoga-beach":{
            link: 'https://dreamerswelcome.com/experience/yoga-beach',
            description: 'Ground yourself with our morning yoga classes, taught by our professional and friendly yoga instructors. These morning classes are given at Ocean Park Beach, just a block away from the Dreamcatcher.',
            title:"Yoga on the Beach in San Juan | Dreamers Welcome"
        },
        "yoga-night":{
            link: 'https://dreamerswelcome.com/experience/yoga-night',
            description: 'Finish off the day with our night yoga classes. With our skillful yoga instructors, you’ll be able to decompress after spending all day at the beach, exploring Old San Juan, or trekking through the rainforest .',
            title:"Night Yoga in San Juan | Dreamers Welcome"
        },
        "yoganc":{
            link: 'https://dreamerswelcome.com/experience/yoganc',
            description: 'Ground yourself with a yoga class, taught by our professional and friendly yoga instructors.',
            title:"Yoga Classes in Wilmington | Dreamers by DW"
        },
    }


    const formattedPropertyName = slug.toLowerCase().replace(/\s/g, '_');
    

    const policyInfo = policyLinksObj[formattedPropertyName] || { link: '', description: '',title:''};

    



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
                    content={seoData?.ogTitle ?? title}
                />
                <meta
                    property="og:description"
                    content={
                        seoData?.ogDescription ?? blurb
                    }
                />
                <meta
                    property="og:image"
                    content={`https:${
                        seoData?.ogImage
                        ? seoData?.ogImage?.fields?.file?.url
                        : bannerImage.fields.file.url
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
                    headerText={title}
                    bookNowLink={bookNowLink}
                    ctaText="RESERVE NOW"
                />
            </BannerGridImage>
            <Blurb text={blurb} />
            <Block
                title="INFO"
                content={
                    <ConceptTextContainer>
                        <BodyText size="xlg">{info}</BodyText>
                    </ConceptTextContainer>
                }
            />
            {details && details.length && (
                <Block
                    title="DETAILS"
                    noPaddingBottom
                    content={
                        <StatsGridModule columns={details.length}>
                            {details &&
                                details.map((stat: any, i: number) => {
                                    const { title, text } = stat.fields
                                    return (
                                        <div key={title}>
                                            {breakpoint == 'mobile' && (
                                                <BodyText size="md">
                                                    {title}
                                                </BodyText>
                                            )}
                                            <Stat>
                                                {parseMoneyOrTime(text, 30)}
                                            </Stat>
                                            {breakpoint !== 'mobile' && (
                                                <BodyText size="md">
                                                    {title}
                                                </BodyText>
                                            )}
                                        </div>
                                    )
                                })}
                        </StatsGridModule>
                    }
                />
            )}

            {thingsToKnow && thingsToKnow.length && (
                <Block
                    title="THINGS TO KNOW"
                    content={
                        breakpoint !== 'mobile' ? (
                            <GridModule
                                columns={thingsToKnow.length}
                                sideScrollOnMobile={false}
                            >
                                {thingsToKnow &&
                                    thingsToKnow.map((thing: any) => (
                                        <BlockListWrap key={thing.fields.title}>
                                            <Header size={4}>
                                                {thing.fields.title}
                                            </Header>
                                            <MarkdownModule
                                                data={thing.fields.text}
                                            />
                                        </BlockListWrap>
                                    ))}
                            </GridModule>
                        ) : (
                            <CollapsableList data={thingsToKnow} />
                        )
                    }
                />
            )}

            {otherExperiences && otherExperiences.length && (
                <StyledBlockForGrid
                    title="MORE EXPERIENCES"
                    fullWidth
                    noPaddingBottom
                    link={`/experiences/${bucketToPath(bucket[0])}`}
                    content={
                        <GridModule
                            columns={otherExperiences.length}
                            sideScrollOnMobile
                        >
                            {otherExperiences &&
                                otherExperiences.length &&
                                otherExperiences.map((exp: any) => (
                                    <ExperienceItem data={exp.fields} />
                                ))}
                        </GridModule>
                    }
                />
            )}
        </>
    )
}

export default Experience

export async function getStaticProps(context: { params: { slug: string } }) {
    const rawData = await getExperience(context.params.slug)
    const stringData = safeJsonStringify(rawData)
    const experience = JSON.parse(stringData)
    const seoData = experience?.seoMetadata?.fields

    
    return {
        props: {
            experience,
            seoData: seoData ?? null
        },
    }
}

export async function getStaticPaths() {
    const experience = await getExperiences()
   
    const paths: any = []
    experience.forEach((x: { fields: { slug: string } }) => {
        const { slug } = x.fields
        paths.push({ params: { slug: slug } })
    })
    return {
        // @ts-ignore
        paths: paths,
        fallback: false,
    }
}
