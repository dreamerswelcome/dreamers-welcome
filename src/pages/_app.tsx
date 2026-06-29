// _app.tsx

import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ViewportProvider } from '../_utils/ViewportProvider'
import TopNav from '../_components/Navigation'
import styled from 'styled-components'
import Footer from '../_components/Footer'
import EmailCapture from '../_components/EmailCapture'
import TagManager from 'react-gtm-module'
import { sendPageViewEvent } from './api/sendPageViewEvent'
import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react'
import '@contentful/live-preview/style.css'
import '../styles/main.scss'
import FirstVisitModal from '../_components/Modal/FirstVisitModal'
import '../../public/styles/global.css'
import '@contentful/live-preview/style.css'
import { initializeGA, trackPageView } from '../_utils/analytics'
import { useHotelDataLayer } from '../_hooks/useHotelDataLayer'

const StyledMain = styled.main`
  width: 100%;
  min-height: 100vh;
`

interface HeaderData {
  bucket?: string
  property?: string
  simpleNav?: boolean
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const pixelID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
  const googleAnalyticsID = 'GTM-KC6QD2H'
  const [navTheme, setNavTheme] = useState(undefined)
  const hideLayout =
    router.pathname === '/spin' || router.pathname.startsWith('/spin/')
  const [headerData, setHeaderData] = useState<HeaderData | undefined>(
    undefined
  )
  const [firstModalShow, setFirstModalShow] = useState(false)

  useHotelDataLayer()

  useEffect(() => {
    console.log('enterning useeffect 2--->')

    initializeGA(googleAnalyticsID)

    trackPageView(router.pathname)

    TagManager.initialize({ gtmId: googleAnalyticsID })
    sendPageViewEvent(`${pixelID}`, { em: 'user@example.com' })
  }, [googleAnalyticsID, router.pathname])

  //   useEffect(() => {
  //   ; (window as any).wloShopID =
  //     '8671e4c5-633a-479f-6ec3-08dec3a87b0e'
 
  //   const script = document.createElement('script')
 
  //   script.src =
  //     'https://cdn.wheelio-app.com/app/index.min.js?v=' +
  //     Date.now()
 
  //   script.async = true
 
  //   script.onload = () => {
  //     console.log('Wheelio loaded')
  //   }
 
  //   script.onerror = () => {
  //     console.log('Wheelio failed')
  //   }
 
  //   document.body.appendChild(script)
  // }, [])

  useEffect(() => {
    const visited = localStorage.getItem('visited')
    const lastVisitTimestamp = localStorage.getItem('lastVisitTimestamp')
    const currentTime = Date.now()

    if (!visited) {
      // First visit------
      localStorage.setItem('visited', 'true')
      localStorage.setItem('lastVisitTimestamp', currentTime.toString())
      setTimeout(() => {
        setFirstModalShow(true)
      }, 10000)
    } else {
      const timeSinceLastVisit = currentTime - parseInt(lastVisitTimestamp, 10)

      if (timeSinceLastVisit >= 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          setFirstModalShow(true)
        }, 10000)

        localStorage.setItem('lastVisitTimestamp', currentTime.toString())
      }
    }
  }, [router.pathname])

  return (
    <>
      <Head>
        <title>
          Boutique Hotels & Laidback Luxury Vacation Rentals | Dreamers Welcome
        </title>
        <meta
          name="description"
          content="From Puerto Rico to North Carolina, every DW luxury vacation rental was designed by creatives and hospitality gurus sharing one beautiful common priority: you."
        />

        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsID}', {
                page_path: '${router.pathname}', 
              });
            `,
          }}
        />
        {/* <script
    defer
    src="https://connect.podium.com/widget.js#ORG_TOKEN=645e6556-2a95-4ca0-b4a9-4ada9de5ddf7"
    id="podium-widget"
    data-organization-api-token="645e6556-2a95-4ca0-b4a9-4ada9de5ddf7"
  /> */}

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="google-site-verification"
          content="1M2WGJ4z9PIe6P57go_NDWoyk79NI9oXBIeRFDM65Jo"
        />
        <meta
          name="facebook-domain-verification"
          content="8i88ic4qn6mgfjigvxmlkt7ih2sp7c"
        />
        <meta
          name="p:domain_verify"
          content="92466f0124ec9f4ae7dd68abc151da17"
        />
        {/* HiJiffy Widget */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
      window.HiJiffyWidget = window.HiJiffyWidget || {};
      window.HiJiffyWidget.Token = 'agNUasa7UsV3kp';

      (function (d, s) {
        var js, fjs = d.getElementsByTagName(s)[0];
        js = d.createElement(s); js.async = true;
        js.src = 'https://widget.hijiffy.com/build.js?t=' + Math.floor(new Date().getTime() / 60000);
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script'));
    `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '1594089821088907');
                        fbq('track', 'PageView');
                    `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          var wloShopID = "8671e4c5-633a-479f-6ec3-08dec3a87b0e";
          var url = "https://cdn.wheelio-app.com/app/index.min.js?v=" + new Date().getTime();
          var wheelio_script = document.createElement("script");
          wheelio_script.setAttribute("src", url);
          document.body.appendChild(wheelio_script);
                    `,
          }}
        />


        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1594089821088907&ev=PageView&noscript=1"
          />
        </noscript>
      </Head>
      <ViewportProvider>
        {!hideLayout && (
          <TopNav navTheme={navTheme} headerData={headerData} />
        )}
        <StyledMain id="main">
          <ContentfulLivePreviewProvider
            locale="en-US"
            enableInspectorMode={true}
            enableLiveUpdates={true}
          >
            <Component
              {...pageProps}
              setHeaderData={setHeaderData}
              setNavTheme={setNavTheme}
            />
          </ContentfulLivePreviewProvider>
        </StyledMain>
        {!hideLayout && <EmailCapture inFirstVisitModal={false} />}
        {!hideLayout && <Footer activeBucket={headerData?.bucket} />}
        <FirstVisitModal
          modalOpen={firstModalShow}
          onClose={() => setFirstModalShow(false)}
        />
      </ViewportProvider>
    </>
  )
}

export default MyApp
