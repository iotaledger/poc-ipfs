FROM node:10.13.0-alpine
RUN apk --no-cache add git

# Working DIR
WORKDIR /usr/src/app

# Copy everything from current Folder
COPY . ./

# Set the env variables
ARG CONFIG_ID
ARG GITHUB_TOKEN
RUN echo "CONFIG_ID=$CONFIG_ID"
RUN echo "GITHUB_TOKEN=$GITHUB_TOKEN"
ENV REACT_APP_CONFIG_ID=$CONFIG_ID

# We are npm installing from private repos so we need github token with access
RUN git config --global url."https://${GITHUB_TOKEN}:@github.com/".insteadOf "https://github.com/"

# Running required steps to prepare the app prod build
RUN npm install
RUN npm install -g serve
RUN npm run build

# Remove all the node_modules so the docker image doesn't exceeds max size
RUN apk del git
RUN rm -rf node_modules

EXPOSE 4001:4001

# Serve the prod build from the build folder
CMD ["serve", "-s", "build", "-p", "4001"]
