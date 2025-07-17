FROM node:20.11.1

RUN useradd -rm mathjax
USER mathjax

WORKDIR /home/mathjax
COPY --chown=mathjax:mathjax . .

RUN npm install

EXPOSE 8003
CMD node -r esm service.js
