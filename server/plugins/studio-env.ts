export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  const studioAuth = (config as Record<string, any>).studio?.auth
  if (!studioAuth) {
    return
  }

  const envMap: Record<string, string | undefined> = {
    STUDIO_GITHUB_CLIENT_ID: studioAuth.github?.clientId,
    STUDIO_GITHUB_CLIENT_SECRET: studioAuth.github?.clientSecret,
  }

  for (const [key, value] of Object.entries(envMap)) {
    if (value && !process.env[key]) {
      process.env[key] = value
    }
  }
})
