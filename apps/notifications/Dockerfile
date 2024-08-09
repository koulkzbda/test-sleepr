FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json

RUN npm i -g pnpm

RUN pnpm i

COPY apps/notifications apps/notifications
COPY libs libs

RUN cd apps/notifications && pnpm i

RUN pnpm run build

FROM node:alpine AS production

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm

RUN pnpm i --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/notifications/main"]