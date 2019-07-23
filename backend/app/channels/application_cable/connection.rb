module ApplicationCable
  class Connection < ActionCable::Connection::Base
    def connect
      puts 'somebody enter the channel'
    end
  end
end
