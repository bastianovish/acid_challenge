# Canal para actualizar en tiempo real al cliente
class DashboardChannel < ApplicationCable::Channel
  def subscribed
    stream_for 'dashboard_channel'
    data = { status: 'success', containers: DockerContainer.all}
    DashboardChannel.broadcast_to('dashboard_channel', data)
  end

  def unsuscribed; end
end
