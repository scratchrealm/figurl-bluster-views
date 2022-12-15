#!/bin/bash

set -ex

TARGET=gs://figurl/bluster-views-1

yarn build
gsutil -m cp -R ./build/* $TARGET/