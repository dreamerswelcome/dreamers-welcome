import React, { useContext, useEffect, useState,useRef } from 'react'
import { Content, GridModule, GridWrapper } from '../../styles/global'
import { viewportContext } from '../../_utils/ViewportProvider'
import PropertyGridItem from '../../_components/PropertyGridItem'
import { getPropertiesViaBucket, getProperties } from '../../_lib/api'
import { pathToBucket } from '../../_utils/Parsers'
import { useRouter } from 'next/router'
import Head from 'next/head'
import SubNavigation from '../../_components/Navigation/SubNavigation'
import Blurb from '../../_components/UI/Blurb'
import { hotelIdMap } from '../../_utils/hotelIdMap'

interface Props {
    properties: any
    setNavTheme: any
    setHeaderData: any
    blurb: any
}

const links_PR: { name: string; slug: string }[] = [
    {
        name: 'VIEW ALL',
        slug: 'view_all',
    },
    {
        name: 'HOTELS',
        slug: "Hotel",
    },
    {
        name: 'HOUSES',
        slug: "House",
    },
    {
        name: 'APARTMENTS+',
        slug: 'Suites',
    }
]
const links_NC: { name: string; slug: string }[] = [
    {
        name: 'VIEW ALL',
        slug: 'view_all',
    },
    {
        name: 'HOTELS',
        slug: "Hotel",
    },
    // {
    //     name: 'HOUSES',
    //     slug: "House",
    // }
]



const Stays = ({ properties, setNavTheme, setHeaderData, blurb, seoData }: Props) => {

    const breakpoint = useContext(viewportContext)
    const router = useRouter()
    const [bucket, setBucket] = useState('');
    const [_blurb, setBlurb] = useState('');
    const firstItemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setNavTheme('dark')

        const bkt = router.query.slug
            ? pathToBucket(router.query.slug[0] as string)
            : undefined
        setBucket(bkt as string)
        setHeaderData({
            bucket: bkt,
        })
    }, [])
     
    useEffect(() => {
        const filteredBlurb = blurb.filter((blurbItem) => {
            switch (bucket) {
                case 'North Carolina':
                    return blurbItem?.fields?.bucket[0] === 'North Carolina';
                default:
                    return blurbItem?.fields?.bucket[0] === 'Puerto Rico';
            }
        });
                                                            
        if (filteredBlurb.length > 0) {
            setBlurb(filteredBlurb[0].fields.blurb);
        }
    }, [bucket, blurb]);

    const [activeSlug, setSlug] = useState<string>(
        (router.query.type as string) || 'view_all'
    )
    const [activeStays, setActiveStays] = useState<any[]>([
        ...properties,
    ])


useEffect(() => {
  if (activeStays && activeStays.length > 0) {
    const hotelIds = activeStays
      .map((property: any) => {
        // ensure slug matches hotelIdMap keys
        const key = property.slug.startsWith("/")
          ? property.slug
          : `/${property.slug}`;
        return hotelIdMap[key];
      })
      .filter(Boolean); // drop any without mapping

    if (hotelIds.length > 0) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "hotelSearchResults",
        hotel_ids: hotelIds,
      });

      console.log("DataLayer pushed:", {
        event: "hotelSearchResults",
        hotel_ids: hotelIds,
      });
    }
  }
}, [activeStays]);
   

    useEffect(() => {
        const queryTag = (router.query.type as string) || ('view_all' as string)
        // @ts-ignore
        setSlug(queryTag)

        const checkForTags = (properties: any[], slug: string) => {

            if (!properties.length) {
                return [...properties]
            }
            return properties.find((tag: any) => tag === slug)
        }

        const propertiesToView =
            queryTag !== 'view_all'
                ? [...properties].filter((items: any) =>
                    checkForTags(items.propertyType, queryTag)
                )
                : [...properties]

        setActiveStays(propertiesToView)

    }, [router, router.query])

   

 

    useEffect(() => {
        if (firstItemRef.current) {
            firstItemRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeStays]);


    
    if (!properties.length) {
        return null
    }

    return (
        <>
            <Head>
                <title>{seoData?.metaTitle}</title>
                <meta name="description" content={seoData?.metaDescription} />
                <link rel="canonical" href={seoData?.canonicalUrl} />
            </Head>
            <Blurb text={_blurb} eyebrow="STAYS" fullHeight />
            <div ref={firstItemRef}></div>
            <Content padding>
              
                {bucket == 'North Carolina' ?
                    <SubNavigation
                        activeSlug={activeSlug}
                        data={links_NC}
                        queryParam="type"
                        queryArray={router.query.slug || []}
                   
                    /> :
                    <SubNavigation
                        activeSlug={activeSlug}
                        data={links_PR}
                        queryParam="type"
                        queryArray={router.query.slug || []}
                       
                    />      
                }
              
           
                <GridWrapper  border={false} padding>
                    <GridModule  columns={bucket == "North Carolina" ? 2 : 3} sideScrollOnMobile={false} >
                        {activeStays &&
                            activeStays.map(
                                (property: { slug: string }, i: number) => (
                                    <PropertyGridItem
                                    collapsed
                                    key={property.slug + i}
                                    propertyObj={property}
                                />
                                )
                            )}
                    </GridModule>
                </GridWrapper>
            </Content>
        </>
    )
}

export default Stays

export async function getStaticProps(context: { params: { slug: string[] } }) {
    const properties = await getPropertiesViaBucket(
        context.params.slug ? context.params.slug[0] : undefined
    )
    const blurb = await getProperties()
    const seoData = blurb?.seoMetadata?.fields

    return {
        props: {
            properties,
            blurb,
            seoData: {
                metaTitle: seoData?.metaTitle ?? "Laidback Luxury Vacation Rentals & Boutique Hotels in Puerto Rico & NC, USA",
                metaDescription: seoData?.metaDescription ?? "Indulge in our laidback luxury vacation rentals & designer hotels with progressive amenities, vegan-forward cuisine, and access to authentic local experiences.",
                canonicalUrl: seoData?.canonicalUrl ?? "https://dreamerswelcome.com/stays"
            }
        },
    }
}

export async function getStaticPaths(context: { params: { slug: string } }) {
    const paths = [
        { params: { slug: ['puertorico'] } },
        { params: { slug: ['northcarolina'] } },
        { params: { slug: [''] } },
    ]
    return {
        // @ts-ignore
        paths: paths,
        fallback: false,
    }
}

