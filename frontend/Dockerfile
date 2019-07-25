FROM mhart/alpine-node:latest
WORKDIR /app
COPY package*.json /app
RUN yarn install --production
COPY . /app
RUN yarn build
RUN yarn global add serve
EXPOSE 8000
CMD serve -s build -p 8000