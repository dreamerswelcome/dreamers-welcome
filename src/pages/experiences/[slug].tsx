import React, { useEffect, useState } from 'react'
import Blurb from '../../_components/UI/Blurb'
import SubNavigation from '../../_components/Navigation/SubNavigation'
import { GridModule, GridWrapper } from '../../styles/global'
import { useRouter } from 'next/router'
import { getExperiences, getExperiencesPage } from '../../_lib/api'
import ExperienceItem from '../../_components/ExperienceItem'
import safeJsonStringify from 'safe-json-stringify'
import { pathToBucket } from '../../_utils/Parsers'
import Head from 'next/head'

const links: { name: string; slug: string }[] = [
  {
    name: 'VIEW ALL',
    slug: 'view_all',
  },
  {
    name: 'ADVENTURE',
    slug: 'adventure',
  },
  {
    name: 'FOOD',
    slug: 'food',
  },
  {
    name: 'WELLNESS',
    slug: 'wellness',
  },
]

const Experiences = ({
  experiences,
  experiencesPage,
  setNavTheme,
  setHeaderData,
  seoData,
}: any) => {
  const [property, setProperty] = useState('')
  const router = useRouter()

  useEffect(() => {
    setNavTheme('dark')

    const slug = router.query.slug as string
    console.log('in the experiences -------', slug)
    setProperty(slug)
    setHeaderData({
      bucket: pathToBucket(slug || ''),
      simpleNav: false,
      property: undefined,
    })
  }, [])
  const { blurb } = experiencesPage

  const [activeSlug, setSlug] = useState<string>(
    (router.query.type as string) || 'view_all'
  )
  const [activeExperiences, setExperiences] = useState<any[]>([...experiences])

  useEffect(() => {
    const queryTag = (router.query.type as string) || ('view_all' as string)
    // @ts-ignore
    setSlug(queryTag)

    const checkForTags = (tags: any[], slug: string) => {
      if (!tags.length) {
        return
      }
      return tags.find((tag: any) => tag.sys.id === slug)
    }

    const expToView =
      queryTag !== 'view_all'
        ? [...experiences].filter((exp: any) =>
            checkForTags(exp.metadata.tags, queryTag)
          )
        : [...experiences]

    setExperiences(expToView)
  }, [router, router.query])

  useEffect(() => {}, [activeExperiences])

  return (
    <>
      <Head>
        <title>{seoData.metaTitle}</title>
        <meta name="description" content={seoData.metaDescription} />
        <link rel="canonical" href={seoData.canonicalUrl} />
      </Head>
      <Blurb text={blurb} eyebrow="EXPERIENCES" fullHeight />

      <SubNavigation
        activeSlug={activeSlug}
        data={links}
        queryParam="type"
        queryArray={router.query.slug || []}
      />
      <GridWrapper padding id="anchor_view">
        <GridModule columns={3}>
          {activeExperiences && activeExperiences.length
            ? activeExperiences.map((exp: any) => (
                <ExperienceItem data={exp.fields} />
              ))
            : null}
        </GridModule>
      </GridWrapper>
    </>
  )
}

export default Experiences

export async function getStaticProps(context: { params: { slug: string } }) {
  const rawData = await getExperiences(context.params.slug)
  const stringData = safeJsonStringify(rawData)
  const experiences = JSON.parse(stringData)
  const experiencesPage = await getExperiencesPage(context.params.slug)
  const seoMetaFields = experiencesPage?.seoMetadata?.fields
  const defaultPageTitle = 'Experiences | Dreamers Welcome'
  const defaultPageDescription =
    'Take advantage of amenities and daily/weekly events in your vacation location of choice. Explore tailored and authentic activities and make the most of your stay'
  const defaultCanonical = `https://dreamerswelcome.com/experiences/${context.params.slug}`

  return {
    props: {
      experiences,
      experiencesPage,
      seoData: {
        metaTitle: seoMetaFields?.metaTitle ?? defaultPageTitle,
        metaDescription:
          seoMetaFields?.metaDescription ?? defaultPageDescription,
        canonicalUrl: seoMetaFields?.canonicalUrl ?? defaultCanonical,
      },
    },
  }
}

export async function getStaticPaths(context: { params: { slug: string } }) {
  const paths = [
    { params: { slug: 'puertorico' } },
    { params: { slug: 'northcarolina' } },
  ]
  return {
    // @ts-ignore
    paths: paths,
    fallback: false,
  }
}
