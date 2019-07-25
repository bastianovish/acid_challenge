# Canal para actualizar en tiempo real al cliente
class DashboardChannel < ApplicationCable::Channel
  def subscribed
    stream_for 'dashboard_channel'
  end

  def unsuscribed; end
end
