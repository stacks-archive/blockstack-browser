# corsproxy-https

> standalone https-only CORS proxy



[![NPM](https://nodei.co/npm/corsproxy-https.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/corsproxy-https/)


## Setup

```
npm install -g corsproxy-https
corsproxy
# with custom port: CORSPROXY_PORT=1234 corsproxy
# with custom host: CORSPROXY_HOST=localhost corsproxy
# with debug server: DEBUG=1 corsproxy
# with custom payload max bytes set to 10MB (1MB by default): CORSPROXY_MAX_PAYLOAD=10485760 corsproxy
```

## Usage

The cors proxy will start at http://localhost:1337.
To access another domain, use the domain name (including port) as the first folder, e.g.

Access https://example.com:3000/sign_in with the following url:

- http://localhost:1337/localhost:3000/sign_in

## License

MIT
