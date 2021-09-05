#!/bin/bash
docker rm -f bonkjail
docker build -t bonkjail . && \
docker run --name=bonkjail -d --rm -p5050:1337 -it bonkjail