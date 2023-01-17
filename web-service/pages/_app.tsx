import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import ThemeProvider from '../components/ThemeProvider'

export default function App({ Component, pageProps }: AppProps) {

  return (
    <Layout>
      <ThemeProvider/>
      <Component {...pageProps} />
    </Layout>
  )
}
