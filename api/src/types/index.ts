// For some reason eslint starts lagging if imported directly
import { NowRequest, NowResponse } from "@vercel/node";

export type Request = NowRequest;

export type Response = NowResponse;
