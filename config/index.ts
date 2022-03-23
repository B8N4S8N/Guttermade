const dev = process.env.NODE_ENV !== "production";

export const rootname = dev ? "localhost:3000" : "punk3.xyz";
export const server = (subdomain?: string | null): string => {
  if (subdomain) {
    return dev
      ? `http://${subdomain}.${rootname}`
      : `https://${subdomain}.${rootname}`;
  }
  return dev ? `http://${rootname}` : `https://${rootname}`;
};
export const appServer = server("app");
export const demoServer = server("demo");
