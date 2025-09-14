Local development quick start (Jekyll site)

1) Ruby via rbenv (recommended)
   - rbenv install -s 3.2.9
   - rbenv local 3.2.9
   - gem install bundler:2.5.14

2) Install gems
   - bundle _2.5.14_ install

3) Run server
   - bundle exec jekyll serve --port 4002
   - Open http://127.0.0.1:4002/

Notes
- If you previously installed 2.7.x switch to 3.2.9 to satisfy lockfile deps.
- If anime.js or video doesn’t load, check DevTools Network for 404/JS errors.
