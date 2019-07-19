class DockerController < ApplicationController
  def stats
    containers = Docker::Container.all
    puts "running containers: #{containers.size}"
    stats = []
    containers.each do |container|
      c = Container.new container.id, container.info, container.stats
      stats << c.serializable_hash
    end
    render json: stats
  end
end
