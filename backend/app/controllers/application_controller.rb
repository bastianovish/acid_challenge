class ApplicationController < ActionController::API
  def index
    puts 'steve'
    render json: { steve: 'mneen' }
  end
end
