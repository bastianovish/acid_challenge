# Controlador que accede a la API de Docker y obtiene las metricas de los contenedores
class DockerController < ApplicationController
  def stats
    containers = DockerContainer.all
    render json: containers
  end
end