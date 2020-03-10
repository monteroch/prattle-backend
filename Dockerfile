# Set the base image to node:12-alpine
FROM node:12-alpine

# Specify where our app will live in the container
WORKDIR /usr/src/app

# Copy package.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application's files
COPY . .

# Expose application's port
EXPOSE 4001

# Defines run command
CMD [ "node", "app.js" ]