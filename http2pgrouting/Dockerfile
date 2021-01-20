FROM node:14.4.0

COPY package.json yarn.lock /http2pgrouting/

WORKDIR /http2pgrouting
RUN yarn
COPY ./src src

ENTRYPOINT ["node"]
CMD ["src/index.js"]