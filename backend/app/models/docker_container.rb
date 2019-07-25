# Clase contenedor de Docker
class DockerContainer
  include ActiveModel::Serialization
  attr_accessor :id, :stats, :name

  def initialize(id, info, stats)
    self.id = id
    self.name = info['Names'].first
    self.stats = stats
  end

  def self.all
    containers = DockerApiService.get_containers
    containers.map { |_, container| new(container[:id], container[:info], container[:stats]).serializable_hash }
  end


  def attributes
    {
      'name' => name, 'cpu_usage' => cpu_usage,
      'memory_usage' => memory_usage, 'memory_limit' => memory_limit,
      'network_i' => network_i, 'network_o' => network_o,
      'block_read' => block_read, 'block_write' => block_write,
      'pids' => pids
    }
  end

  private

  def cpu_usage
    cpu_percent = 0.0
    cpu_stats = stats['cpu_stats']
    precpu_stats = stats['precpu_stats']
    cpu_delta = (cpu_stats['cpu_usage']['total_usage'] || 0) - (precpu_stats['cpu_usage']['total_usage'] || 0)
    system_delta = cpu_stats['system_cpu_usage'] - precpu_stats['system_cpu_usage'] if cpu_stats['system_cpu_usage'] && cpu_stats['system_cpu_usage'].to_i > 0
    if cpu_delta.positive? && system_delta.positive?
      ratio = cpu_delta.to_f / system_delta
      cpu_percent = ratio * cpu_stats['cpu_usage']['percpu_usage'].length * 100
    end
    '%.3f%%' % cpu_percent
  end

  def memory_usage
    '%.2f MiB' % (((stats['memory_stats']['usage'].to_f || 0) - (stats['memory_stats']['stats']['cache'].to_f|| 0))/ (1024 * 1024))
  end

  def memory_limit
    '%.3f GiB' % ((stats['memory_stats']['limit'].to_f || 0)/(1024 * 1024 * 1024))
  end

  def network_i
    '%.1f kB' % ((stats['network']['rx_bytes'].to_f || 0)/1024)
  end

  def network_o
    '%.2f kB' % ((stats['network']['tx_bytes'].to_f || 0 )/1024)
  end

  def block_read
    io = stats['blkio_stats']['io_service_bytes_recursive']
    return 0 if io.empty?
    '%.2f MB ' % (io.filter { |a| a['op'] == 'Read' }.first['value'].to_f / (1024 * 1024))
  end

  def block_write
    io = stats['blkio_stats']['io_service_bytes_recursive']
    return 0 if io.empty?
    '%.2f MB' % (io.filter { |a| a['op'] == 'Write' }.first['value'].to_f / (1024 * 1024))
  end

  def pids
    stats['pids_stats']['current']
  end
end
