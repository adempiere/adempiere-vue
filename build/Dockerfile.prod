FROM node:12-alpine

LABEL maintainer="ysenih@erpya.com" \
	description="ADempiere Vue Default Theme"

# Init ENV with default values
ENV VS_ENV=prod \
    REPOSITORY_PATH="/var/www/adempiere-vue" \
    REPOSITORY_NAME="adv-default-theme" \
    URL_BASE_REPOSITORY="https://github.com/adempiere/adempiere-vue.git" \
    SERVER_PORT="9527" \
    SERVER_HOST="localhost" \
    API_URL="http:\/\/localhost:8085" \
    MEMORY_RESTART="1G" \
    EXEC_INSTANCES="1"

COPY dist-app/ /var/www/adv-default-theme/

RUN rm -rf /var/cache/apk/* && \
  apk add --no-cache --virtual .build-deps ca-certificates wget python3 make g++ \
  && apk add --no-cache git \
  && yarn install --no-cache \
  && apk del .build-deps && \
    apk --no-cache --update upgrade musl && \
    apk add --no-cache \
                --repository http://dl-cdn.alpinelinux.org/alpine/edge/community \
                --repository http://dl-cdn.alpinelinux.org/alpine/edge/main \
                --virtual .build-deps \
     unzip \
     curl && \
     echo "Downloading ... $URL_BASE_REPOSITORY to $REPOSITORY_PATH" && \
     git clone $URL_BASE_REPOSITORY $REPOSITORY_PATH && \
     cd $REPOSITORY_PATH && \
     git submodule add /var/www/adv-default-theme ./src/themes/default && \
     git submodule update --init ./src/themes/default && \
     yarn && \
     yarn build:prod && \
     chmod -R 777 $REPOSITORY_PATH

# Copy Default files
COPY build/default.json $REPOSITORY_PATH/config/
COPY build/start.sh $REPOSITORY_PATH

WORKDIR $REPOSITORY_PATH

# Start app
CMD	'sh' 'start.sh'
