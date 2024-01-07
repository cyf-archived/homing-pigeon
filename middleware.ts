import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages } from "./i18n/settings";
import { cacheLngKey, cacheTokenKey, basePath } from "./constants";

acceptLanguage.languages(languages);

export const config = {
  // matcher: '/:lng*'
  matcher: [
    "/((?!api|_next/static|_next/image|images|videos|assets|favicon.ico|logo.png|sitemap.xml|sw.js).*)",
    { source: "/" },
  ],
};

const cookieName: string = cacheLngKey;
const getPath = (lng: string) => `${basePath}/${lng}`;

const protectedPages = ["/admin"];

export function middleware(req: NextRequest) {
  let lng;
  if (req.cookies.has(cookieName)) {
    const lngFromCookie = req.cookies.get(cookieName)!.value;
    lng = acceptLanguage.get(lngFromCookie);
  }
  if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  if (!lng) lng = fallbackLng;

  // Redirect if lng in path is not supported\
  const pathname = req.nextUrl.pathname;

  const protectedPathnameRegex = RegExp(
    `^(/(${languages.join("|")}))?(${protectedPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i",
  );
  const isProtected = protectedPathnameRegex.test(pathname);
  const token = req.cookies.get(cacheTokenKey)?.value;
  if (!token && isProtected) {
    return NextResponse.redirect(
      new URL(
        `${getPath(lng)}${pathname.startsWith("/") ? "" : "/"}/login`,
        req.url,
      ),
    );
  }

  if (
    !languages.some((loc) => pathname.startsWith(`/${loc}`)) &&
    !pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(
        `${getPath(lng)}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        req.url,
      ),
    );
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer") as string);
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`),
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}
