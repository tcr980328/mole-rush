const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const assetPrefix = isGitHubPages && repositoryName ? `/${repositoryName}` : "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  assetPrefix,
} as const;

export default nextConfig;
