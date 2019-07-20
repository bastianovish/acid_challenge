# Clase contenedor de Docker
class Container
  include ActiveModel::Serialization
  attr_accessor :id, :stats, :name

  def initialize(id, info, stats)
    self.id = id
    self.name = info['Names'].first
    self.stats = stats
  end

  def attributes
    {
      'name' => name,
      'cpu_usage' => cpu_usage,
      'memory_usage' => memory_usage,
      'memory_limit' => memory_limit,
      'network_i' => network_i,
      'network_o' => network_o,
      'block_read' => block_read,
      'block_write' => block_write
    }
  end

  def cpu_usage
    cpu_percent = 0.0
    cpu_stats = stats['cpu_stats']
    precpu_stats = stats['precpu_stats']
    cpu_delta = cpu_stats['cpu_usage']['total_usage'] - precpu_stats['cpu_usage']['total_usage']
    system_delta = cpu_stats['system_cpu_usage'] - precpu_stats['system_cpu_usage']
    if (cpu_delta > 0) && (system_delta > 0)
      ratio = cpu_delta.to_f / system_delta
      cpu_percent = ratio * cpu_stats['cpu_usage']['percpu_usage'].length * 100
    end
    cpu_percent
  end

  def memory_usage
    stats['memory_stats']['usage'].to_f / (1024 * 1024) - stats['memory_stats']['stats']['cache'].to_f / (1024 * 1024)
  end

  def memory_limit
    stats['memory_stats']['limit'].to_f / (1024 * 1024 * 1024)
  end

  def network_i
    stats['network']['rx_bytes'].to_f / 1024
  end

  def network_o
    stats['network']['tx_bytes'].to_f / 1024
  end

  def block_read
    io = stats['blkio_stats']['io_service_bytes_recursive']
    return 0 if io.empty?
    io.filter { |a| a['op'] == 'Read' }.first['value'].to_f / (1024 * 1024)
  end

  def block_write
    io = stats['blkio_stats']['io_service_bytes_recursive']
    return 0 if io.empty?
    io.filter { |a| a['op'] == 'Write' }.first['value'].to_f / (1024 * 1024)
  end
end
