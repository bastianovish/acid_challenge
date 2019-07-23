# Job que se encarga de notificar vía websocket al dashboard el nuevo estado de los contenedores
class NotifierJob < ApplicationJob

  def perform
    puts 'Performing notifier job'
    containers = Rails.cache.read('docker_containers')
    puts 'containers read' , containers
    data = { status: 'success', timestamp: Time.now.to_i, containers: containers }
    DashboardChannel.broadcast_to 'dashboard_channel', data
  end
end