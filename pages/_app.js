import {Analytics} from '@vercel/analytics/react';
import Script from 'next/script'

function MyApp({Component, pageProps}) {
    return (
        <>
            <Component {...pageProps} />
            <Analytics/>
            <Script strategy="afterInteractive" src="https://analytics.umami.is/script.js"
                    data-website-id="6fa86d7f-8c94-4fcb-94c4-5e9a08f7e2f2" />
        </>
    );
}

export default MyApp;
