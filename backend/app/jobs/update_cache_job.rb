# Job que se encarga de actualizar el resultado de las métricas de los contenedores en cache
class UpdateCacheJob < ApplicationJob
  def perform
    puts 'Performing updater job'
    containers = DockerContainer.all
    Rails.cache.write('docker_containers', containers, expires_in: 10.seconds)
  end
end