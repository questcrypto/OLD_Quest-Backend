FROM node:12
# Set the working directory
WORKDIR /usr/src/app
COPY ./ ./
COPY ["tsconfig.build.json", "/usr/src/app/"]
COPY ["package*.json", "/usr/src/app/"]
RUN npm install --save ipstack
RUN npm install jwt-decode
RUN npm install cors
#RUN npm i pm2
RUN npm run build
#RUN npm install -g @nestjs/cli
#RUN npm install pm2 -g
CMD npm run start:dev
CMD node dist/main.js
