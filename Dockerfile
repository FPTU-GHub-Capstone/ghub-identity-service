FROM node

WORKDIR /home/app

COPY . .

RUN yarn

CMD ["yarn", "start:dev"]