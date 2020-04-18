import debug from "debug";

// TODO: Disable in prod, keep in dev and staging
if (typeof window !== "undefined") {
  localStorage.setItem("debug", "*");
}

export default debug;
