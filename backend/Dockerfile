FROM ruby:2.5

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  postgresql-client \
  && rm -rf /var/lib/apt/lists/*
RUN mkdir /app
WORKDIR /app
COPY Gemfile /app/
RUN bundle install
COPY . /app
EXPOSE 3000
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["bundle", "exec","puma","-C","config/puma.rb"]