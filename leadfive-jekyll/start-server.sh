#!/bin/bash
cd /Users/leadfive/Desktop/system/022_HP/leadfive-jekyll
echo "Starting Jekyll server..."
eval "$(rbenv init -)"
bundle exec jekyll serve --config _config.yml,_config_dev.yml --port 4000