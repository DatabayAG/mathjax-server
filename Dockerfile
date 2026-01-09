FROM node:22.21.1

RUN useradd -rm mathjax
USER mathjax

WORKDIR /home/mathjax
COPY --chown=mathjax:mathjax . .

RUN npm clean-install --no-scripts

EXPOSE 8003
CMD node service.js
