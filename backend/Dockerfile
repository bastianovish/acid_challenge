FROM ruby:2.6.0

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  postgresql-client \
  && rm -rf /var/lib/apt/lists/*
RUN mkdir /backend
WORKDIR /backend
COPY Gemfile /backend/
RUN bundle install
COPY . /backend

COPY entrypoint.sh /usr/bin
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000
CMD ["bundle", "exec","puma","-C","config/puma.rb"]