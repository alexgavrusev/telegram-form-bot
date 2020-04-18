import cookie from "cookie";

const getRefreshTokenCookie = (refreshToken: string) =>
  cookie.serialize("refresh", refreshToken, {
    sameSite: "lax",
    httpOnly: true,
    path: "/",
  });

export default getRefreshTokenCookie;
