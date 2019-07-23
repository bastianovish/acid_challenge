# Canal para actualizar en tiempo real al cliente
class DashboardChannel < ApplicationCable::Channel
  def subscribed
    stream_for 'dashboard_channel'
    data = { status: 'success', timestamp: Time.now.to_i, containers: DockerContainer.all}
    DashboardChannel.broadcast_to('dashboard_channel', data)
    #NotifierJob.set(wait: 5.second).perform_later
  end

  def unsuscribed; end
end
