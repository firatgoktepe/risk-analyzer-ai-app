import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'tr'],

    // Used when no locale matches
    defaultLocale: 'en',

    // Don't add the default locale prefix for English
    localePrefix: 'as-needed'
});

export const config = {
    // Match only internationalized pathnames
    matcher: [
        // Match all pathnames except for
        // - /api routes
        // - /_next (Next.js internals)
        // - /_vercel (Vercel internals)
        // - all root files inside /public (e.g. /favicon.ico)
        '/((?!api|_next|_vercel|.*\\..*|favicon.ico).*)'
    ]
};
