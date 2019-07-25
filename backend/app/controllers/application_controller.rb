class ApplicationController < ActionController::API
  def index
    render json: { nothing: 'to show' }
  end
end
