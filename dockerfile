FROM node:20-alpine

ENV NODE_ENV=production

ENV PORT=3000

WORKDIR /usr/app

COPY . .

RUN yarn build

RUN yarn

EXPOSE 3000

CMD ["yarn", "start"]