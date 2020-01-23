#!/bin/sh

setEnv () {
    local NAME=$1;
    local VALUE=$2;
    if [ -n "$VALUE" ]
    then
        echo "$NAME: $VALUE"
        NAME=${NAME//\//\\\/}
        VALUE=${VALUE//\//\\\/}
        sed -i "s/$NAME/${VALUE}/g" /usr/share/nginx/html/umi.*.js
    fi
}


# 设置环境变量，用指定api服务器uri替换默认api
setEnv "https://api.jamma.cn" "$api"
nginx -g 'daemon off;'
