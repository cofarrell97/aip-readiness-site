/* Serves a pursuit's logo: GET /.netlify/functions/logo?t=<token> -> PNG, or 404.
   Logos are written by the IFS Copperleaf Hub into this site's "logos" blob store,
   keyed by pursuit token. Public by design: a logo is not secret, and the token is
   needed to find it. */
const { connectLambda, getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const t = String((event.queryStringParameters || {}).t || '').toLowerCase();
  if (!/^[a-z0-9.\-]{3,60}$/.test(t)) return { statusCode: 404, headers: { 'Cache-Control': 'no-store' }, body: '' };
  try {
    connectLambda(event);
    const data = await getStore('logos').get(t, { type: 'arrayBuffer' });
    if (!data) return { statusCode: 404, headers: { 'Cache-Control': 'public, max-age=60' }, body: '' };
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' },
      body: Buffer.from(data).toString('base64'),
      isBase64Encoded: true
    };
  } catch (e) {
    return { statusCode: 500, headers: { 'Cache-Control': 'no-store' }, body: '' };
  }
};
