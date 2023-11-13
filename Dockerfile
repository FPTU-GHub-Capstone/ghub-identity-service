FROM node:18-alpine as base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

FROM base as dev
COPY . .
CMD ["yarn", "start:dev"]