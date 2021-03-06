# Servicio que conecta con la API de Docker
class DockerApiService
  def self.get_containers
    containers = Docker::Container.all # Obtiene solo los contenedores corriendo por defecto
    stats = {}
    threads = []
    # Obtenemos las stats de cada contenedor corriendo en paralelo
    containers.each do |container|
      threads << Thread.new(container, stats) do |c, s|
        s[c.id] = { id: c.id, info: c.info, stats: c.stats }
      end
    end
    threads.each(&:join) if threads.length > 0
    stats
  end
end