import Head from 'next/head'

export default function SpinPage() {
  return (
    <>
      <Head>
        <title>Spin</title>
        <meta name="robots" content="noindex" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Add your script here. Example:
              console.log('Spin page script running')
            `,
          }}
        />
      </Head>
      <div id="spin-root" />
    </>
  )
}
