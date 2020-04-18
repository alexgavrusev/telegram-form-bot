import React, { FC } from "react";
import NextHead from "next/head";

const title = "TelegramFormBot";
const description = "Get telegram messages from conversions on your websites";
const image = `${process.env.SITE_URL}/icon-1200x1200.png`;
const imageDimesion = "1200";

const Head: FC = () => (
  <NextHead>
    <title>{title}</title>
    <meta name="description" content={description} />

    <meta property="og:type" content="website" />
    <meta property="og:url" content={process.env.SITE_URL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:image:width" content={imageDimesion} />
    <meta property="og:image:height" content={imageDimesion} />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#3f51b5" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/apple-touch-icon-180x180.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="152x152"
      href="/apple-touch-icon-152x152.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="120x120"
      href="/apple-touch-icon-120x120.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="76x76"
      href="/apple-touch-icon-76x76.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="60x60"
      href="/apple-touch-icon-60x60.png"
    />
  </NextHead>
);

export default Head;
