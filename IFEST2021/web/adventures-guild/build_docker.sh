#!/bin/bash
docker rm -f adventures_guild
docker build -t adventures_guild . && \
docker run --name=adventures_guild -d --rm -p8989:1337 -it adventures_guild
