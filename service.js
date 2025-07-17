/**
 * Server for rendering latex expressions
 * Adapted from https://github.com/mathjax/MathJax-demos-node/blob/master/simple/tex2svg
 * run with: node -r esm service.js
 */

/**
 * Configuration for rendering single latex expressions
 */
const math_config = {
  options: {
    enableAssistiveMml: false
  },
  loader: {
    load: ['adaptors/liteDOM', 'tex-svg']
  },
  tex: {
    packages: ['base', 'autoload', 'require', 'ams', 'newcommand'],
  },
  svg: {
    fontCache: 'none',    // fonts must be in every single svg
  },
};

/**
 *  Minimal CSS needed for stand-alone image, see component/tex2svg
 */
const math_css = [
  'svg a{fill:blue;stroke:blue}',
  '[data-mml-node="merror"]>g{fill:red;stroke:red}',
  '[data-mml-node="merror"]>rect[data-background]{fill:yellow;stroke:none}',
  '[data-frame],[data-line]{stroke-width:70px;fill:none}',
  '.mjx-dashed{stroke-dasharray:140}',
  '.mjx-dotted{stroke-linecap:round;stroke-dasharray:0,140}',
  'use[data-c]{stroke-width:3px}'
].join('');

const http = require('http');
const qs = require('querystring');
const port = 8003;
const server = http.createServer(async (request, response) =>
{
  let body = '';
  request.on('data', function (data) {
    body += data;
    if (body.length > 1e8) {
      request.connection.destroy();
    }
  });

  request.on('end', async function () {

    try {
      const post = JSON.parse(body);
      let output = 'Unknown request';
      if (post.math) {
        output = await renderMath(math_config, post);
      }

      response.statusCode = 200;
      response.setHeader('Content-Length', output.length);
      response.end(output);
    }
    catch (error) {
      console.log(error);
      response.statusCode = 500;
      response.end(error.message);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/**
 * Render a single latex expression
 */
async function renderMath(config, post) {
  const MathJax = await require('mathjax-full').init(config);
  return await MathJax.tex2svgPromise(post.math, {
    // display: false,             // false to process as inline math
    // em: 16,                     // em-size in pixels
    // ex: 8,                      // ex-size in pixels
    // containerWidth: 80 * 16     //width of container in pixels
  }).then((node) => {
    const adaptor = MathJax.startup.adaptor;
    const html = adaptor.innerHTML(node);
    return html.replace(/<defs>/, `<defs><style>${math_css}</style>`);
  });
}
