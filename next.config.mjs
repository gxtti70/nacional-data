/** @type {import('next').NextConfig} */
// En dev, webpack ejecuta los módulos vía eval() (devtool eval-source-map),
// por lo que script-src requiere 'unsafe-eval' para que la hidratación del
// cliente no quede bloqueada por la CSP. En producción no se usa eval, así
// que la política se mantiene estricta.
const isDev = process.env.NODE_ENV === 'development'
const scriptSrc = `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Content-Security-Policy', value: `default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; ${scriptSrc}; font-src 'self'; connect-src 'self' ws: wss:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'` },
]

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
export default nextConfig
