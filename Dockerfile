FROM node:15
WORKDIR /app
COPY package.json .
#RUN npm install
# prevent dev dependencies to be installed
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \          
        fi
COPY . ./
ENV PORT 3000
EXPOSE $PORT
CMD ["node","index.js"]          
# CMD ["npm","start"]           #same command as above