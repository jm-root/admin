FROM circleci/node:latest-browsers as build-deps

WORKDIR /usr/src/app/
USER root
COPY package.json ./
RUN yarn

COPY ./ ./

RUN npm run build

FROM nginx:alpine
COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/html
COPY run.sh /
RUN chmod +x /run.sh
CMD ["./run.sh"]
