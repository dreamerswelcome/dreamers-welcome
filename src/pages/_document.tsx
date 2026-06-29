
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head />

        <body>
          <Main />
          <NextScript />

          {/* Wheelio Configuration */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.wloShopID = "8671e4c5-633a-479f-6ec3-08dec3a87b0e";
              `,
            }}
          />

          {/* Wheelio Script */}
          <script
            async
            src="https://cdn.wheelio-app.com/app/index.min.js"
          />
        </body>
      </Html>
    )
  }
}