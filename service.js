/**
 * Server for rendering latex expressions
 * Adapted from https://github.com/mathjax/MathJax-demos-node/blob/master/simple/tex2svg
 * run with: node service.js
 */

/**
 * Configuration for rendering single latex expressions
 */
const math_config = {
  loader: {
    load: ['input/tex', 'output/svg']
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

main();

async function main() {
  const MathJax = await require('mathjax').init(math_config);
  const adaptor = MathJax.startup.adaptor;

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
          const svg = MathJax.tex2svg(post.math);
          const html = adaptor.innerHTML(svg);
          output = html.replace(/<defs>/, `<defs><style>${math_css}</style>`)
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
}
