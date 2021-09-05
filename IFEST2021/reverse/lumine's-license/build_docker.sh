#!/bin/bash
docker rm -f lumine_license
docker build -t lumine_license . && \
docker run --name=lumine_license -d --rm -p7002:80 -it lumine_license
