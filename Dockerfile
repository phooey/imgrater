FROM node:16-alpine AS base
# First stage: install app dependencies
FROM base AS build
WORKDIR /home/node/app
COPY yarn.lock package.json ./
RUN chown -R node:node /home/node/app
USER node
RUN yarn --prod --frozen-lockfile --ignore-scripts

# Second stage: copy app dependencies and built app source
FROM base
WORKDIR /home/node/app
COPY --from=build /home/node/app/node_modules ./node_modules
COPY log4js.config.json ./dist/ ./
USER node
ENV NODE_ENV production
CMD [ "node", "index.js"]
