const dev = process.env.NODE_ENV !== "production";

export const rootname = dev ? "localhost:3000" : "punk3.xyz";
export const server = dev ? `http://${rootname}` : `https://${rootname}`;
export const appServer = dev
  ? `http://app.${rootname}`
  : `https://app.${rootname}`;
export const demoServer = dev
  ? `http://demo.${rootname}`
  : `https://demo.${rootname}`;
