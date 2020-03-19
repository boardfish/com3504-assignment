FROM ruby:latest
WORKDIR /local
COPY Gemfile .
# COPY Gemfile.lock .
RUN bundle install
EXPOSE 4000
CMD ["rackup", "-p", "4000", "-o", "0.0.0.0", "config.ru"]
