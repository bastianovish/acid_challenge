# Descripción

El desafío consiste en desarrollar una aplicación que muestre un dashboard con la información de los contenedores de Docker que están corriendo en el sistema.

### Restricciones

- Se debe construir utilizando Ruby on Rails y React.
- Se debe cumplir que el tráfico entre el backend y el frontend pasen por Traefik.
- Se debe conectar mediante ActionCable en tiempo real y recibir actualizaciones cada 10 segundos.
- La aplicación debe estar Dockerizada.

# Tecnologías y librerías utilizadas

- **Backend**: Ruby 2.6, Ruby On Rails 5.2.3, ActionCable, Sidekiq, Sidekiq-Scheduler, Docker Api.
- **Frontend**: React, Redux, Material UI.
- **Orchestration**: Traefik, Docker, Docker-Compose.
- **Deploy**: AWS ECS, Cloudflare.

# Background y approach

Lo primero fue investigar cómo obtener las métricas de los contenedores corriendo en el sistema. Para esto se encontraron las siguientes opciones:

- [Docker Stats](https://docs.docker.com/engine/reference/commandline/stats/) : Comando de docker que muestra un stream de métricas en tiempo real de los contenedores corriendo en la máquina que se ejecutó.
- [Docker Engine API ](https://docs.docker.com/develop/sdk/): API oficial que permite interactuar con el Docker Daemon desde los contenedores. Cuenta con una [gema](https://github.com/swipely/docker-api) no oficial para Ruby.
- Manualmente: Se pueden recolectar las métricas de los contenedores desde distintas carpetas / archivos como lo hace [cAdvisor](https://github.com/google/cadvisor), un sistema de Monitoring para contenedores desarrollado por Google con soporte nativo para Docker, que muestra información detallada de cada contenedor en el sistema, con soporte para exportar los datos a otros sistemas, como Prometheus ó Elastic Search.

Debido a la restricción de que la aplicación debe estar dockerizada, se asume entonces que la aplicación debe acceder al demonio de docker, desde dentro del contenedor mismo; por lo tanto la opción de usar docker stats queda descartada, ya que ese comando se ejecuta desde la máquina misma y no dentro de los contenedores. Aparte iría en contra de la filosofía misma de Docker el ejecutar comandos de la máquina padre desde dentro de un contenedor.

De las dos últimas opciones, **cAdvisor** no ofrece estadísticas resumidas de los contenedores, sino mas bien métricas individuales de cada contenedor, por lo tanto la opción elegida fue utilizar **Docker Engine API** a través de la gema de Ruby.
El objetivo era lograr un dashboard que mostrara los contenedores corriendo y las siguientes métricas:

- Nombre del Container.
- Uso de CPU.
- Uso de Memoria.
- Limite de Memoria.
- I/O de Red.
- I/O de Disco.
- Número de Procesos/Threads creados por el container.

Similar a la información que entrega el comando docker stats:

| CONTAINER ID | NAME     | CPU   | MEM USAGE           | NET I/O         | BLOCK I/O      | PIDS |
| ------------ | -------- | ----- | ------------------- | --------------- | -------------- | ---- |
| 8b86c00d65f3 | frontend | 0.00% | 19.04MiB / 1.952GiB | 142kB / 2.91kB  | 24.6kB / 4.1kB | 11   |
| e55e28de2592 | backend  | 4.79% | 64.9MiB / 1.952GiB  | 2.76kB / 1.46kB | 73.7kB / 0B    | 21   |
| bab6082988c3 | jobs     | 1.80% | 64.39MiB / 1.952GiB | 40kB / 50.5kB   | 4.1kB / 0B     | 26   |
| 5fb21f06bddc | traefik  | 0.19% | 10.52MiB / 1.952GiB | 3.86kB / 2.58kB | 2.17MB / 0B    | 13   |
| d0af71cfd9f2 | redis    | 1.02% | 2.445MiB / 1.952GiB | 52.1kB / 39.6kB | 0B / 0B        | 4    |

La desventaja de esta opción, es que la API no ofrece un método como docker stats; que muestra un resumen de todos los contenedores corriendo. Por lo tanto para obtener las métricas de los contenedores corriendo, se debe listar primero los contenedores corriendo, y luego obtener las métricas individualmente de cada contenedor corriendo, por lo cual resulta una operación costosa en tiempo de ejecución.

# Desarrollo

### Backend

El backend de la aplicación consiste en un Modelo (DockerContainer) que se encarga de obtener los contenedores a través de un Servicio (DockerApiService) que se conecta a la API de Docker. Este modelo se encarga también de parsear los datos obtenidos desde la API de Docker.
El Backend expone dos rutas hacia el exterior:

- /containers: Endpoint HTTP (DockerController) que entrega un JSON con las métricas seleccionadas a través de ActiveModel::Serialization (DockerContainer.all).
- /websocket: Endpoint WS que crea una conexión mediante ActionCable.

Para lograr el requerimiento de actualizar la información cada 10 segundos, se implementaron dos Background Jobs, calendarizados con [Sidekiq-Scheduler](https://github.com/moove-it/sidekiq-scheduler), ya que Sidekiq no permite cron jobs en su versión gratuita. Los dos jobs son los siguientes:

```
:schedule:
  UpdateCacheJob:
    every: ['5s', first_in: 0s]
  NotifierJob:
    every: '10s'
```

El primero (UpdateCacheJob) se encarga de obtener los contenedores corriendo y sus métricas, y generar el JSON de salida, para luego almacenarlo en cache usando Rails.cache.

El segundo (NotifierJob) se encarga de leer el caché y notificar a los clientes que están suscritos al canal de notificaciones (DashboardChannel).

Debido a que tenemos que recolectar individualmente las métricas de cada contenedor; si lo hacemos de forma sincrónica (uno tras otro), el tiempo total dependería de la cantidad de contenedores corriendo en el sistema (de 1 a 2 segundos por contenedor), por lo cual podría inducir a errores en las actualizaciones que se envían por cable. Por lo tanto se abordó de forma paralela para obtener las estadísticas de todos los contenedores de forma independiente utilizando la clase Threads de Ruby.

```
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
```

### Frontend

El frontend utiliza una arquitectura Redux. Esto significa que hay un global state o Store que contiene el estado de la aplicación y que solo es modificable a través de las acciones que pasan a través de los reducers.
La idea principal era prescindir de Redux mediante el uso del Hook nativo useReducer de React, pero por temas de tiempo no se implementó una función que reemplazara la función combineReducers de Redux, por lo cual se incorporó la librería Redux solo para importar la función combineReducers.

El flujo del frontend es el siguiente:

- Primero se hace un Fetch al backend a la ruta de los contenedores
- Si la respuesta es exitosa (200) agregamos los contenedores obtenidos al Store mediante la acción ADD_CONTAINERS del containerReducer
- Luego de obtener los contenedores, conectamos el cable mediante el hook personalizado useCable que hace uso del cableReducer y sus acciones (CONNECT_CABLE_BEGIN, CONNECT_CABLE_SUCCESS) y dejamos la conexión abierta para recibir las actualizaciones
- Cada vez que obtenemos alguna actualización con el estado de los nuevos contenedores, se gatilla el action ADD_CONTAINERS para actualizar el dashboard.

Se podría haber trabajado solo con el cable y conectarse inmediatamente a través de websockets, sin necesidad de utilizar un endpoint de la API a través de HTTP; pero se decidió conectar el cable una vez finalizara el fetching inicial para trabajar con más protocolos sobre Traefik, aparte de darle más uso al backend, **_pero por sobre todo para que el botón de Desconectado se alcanzara a ver por unos instantes_**.

# Environments y Live Demo

### Development

Para montar el proyecto localmente en desarrollo se utiliza docker-compose con los comandos

    docker-compose -f docker-compose.development.yml build
    docker-compose -f docker-compose.development.yml up

Esto descargará las imagenes usadas por los Dockerfiles y montará los servicios, teniendo a Traefik como reverse proxy con los siguientes Hosts:

```
Frontend: http://dashboard-frontend.localhost/
Backend: http://dashboard-backend.localhost/
Traefik Dashboard: http://dashboard-metrics.localhost/
```

### Production

Para subirlo a AWS se siguieron los siguientes pasos:

1. Tener un dominio disponible para apuntar a AWS o utilizar el dominio que AWS te da por defecto (en mi caso ocupé uno que tenía en GoDaddy: chi-por.com) y setear las ENV en el frontend para apuntar a este dominio cuando haga las llamadas a la API.

2. Subir las imagenes del Docker-Compose (docker-compose.yml) a un repositorio (Docker Hub) y crear el nuevo archivo de Docker Compose que se utilizará para producción (docker-compose.production.yml) con las imagenes del Docker Hub.

3. Crear cluster configuration en AWS

   `ecs-cli configure --cluster {cluster-name} --region us-east-2 --default-launch-type EC2 --config-name {cluster-name}`

4. Crear perfil con API y SECRET si el perfil no está creado

   `ecs-cli configure profile --access-key {AWS_API_KEY} --secret-key {AWS_API_SECRET} --profile-name {cluster-name}`

5. Crear Cluster (Para el caso de prueba utilicé una instancia t2.medium con 4GB de memoria)

   `ecs-cli up --keypair {ssh-keypair} --capability-iam --instance-type t2.medium --cluster-config {cluster-name}`

   Lo que nos entrega una VPC, un Security Group y 2 Subnets.

   ```
   VPC created: vpc-id
   Security Group created: sg-id
   Subnet created: subnet-id
   Subnet created: subnet-id-2
   ```

6. Deploy Docker-Compose al Cluster con los parametros especificados en ecs-params.yml, los cuales particionan los recursos de la instancia de AWS.

   `ecs-cli compose --file docker-compose.production.yml --ecs-params ecs-params.yml up --create-log-groups --cluster-config {cluster-name}`

7. Crear un Application Load Balancer y apuntarlo al cluster con los parametros obtenidos anteriormente (VPC,SG,SN1,SN2)

8. Apuntar el Dominio a Cloudflare y configurar los DNS de Cloudflare para que apunten al Load Balancer.

### Demo

En este caso los subdominios que se crearon en Cloudflare para el ingreso del tráfico son los siguientes:

- http://chi-por.com: Enruta el tráfico hacia el Frontend
- http://api.chi-por.com: Enruta el tráfico hacia el Backend
- http://dashboard.chi-por.com: Enruta el tráfico hacia el Traefik Dashboard

# Mayores desafíos y apreciaciones

Los mayores problemas o desafíos con los que me encontre en esta prueba técnica fueron los siguientes:

- Uso de Traefik como reverse proxy por primera vez. Estuve harto tiempo solucionando un error que hacía que me conectara con la API a través de HTTP, pero fallaba en el WS. Pensé que era por Traefik así que probe muchas labels para resolverlo y al final era un problema con los permisos del ActionCable.
- No contar con un comando o método para obtener las métricas de todos los contenedores corriendo en una sola llamada desde adentro de un contenedor.
- La nula documentación acerca de donde salen los números que arroja el comando docker stats, sobre todo en cuanto al uso de CPU y memoria. Si bien en la documentación explica que representan estas métricas, no dice en ningun lado como son calculados, por lo cual hay que recurrir a la definición de las funciones mismas en el código o uno que otro articulo que se pilla en la red.

El cálculo del uso de CPU está definido como:

```
    cpu_percent = 0.0
    cpu_stats = stats['cpu_stats']
    precpu_stats = stats['precpu_stats']
    cpu_delta = cpu_stats['cpu_usage']['total_usage'] - precpu_stats['cpu_usage']['total_usage']
    system_delta = cpu_stats['system_cpu_usage'] - precpu_stats['system_cpu_usage']
    if cpu_delta.positive? && system_delta.positive?
      ratio = cpu_delta / system_delta
      cpu_percent = ratio * cpu_stats['cpu_usage']['percpu_usage'].length * 100
    end
```

Y la memoria utilizada como

```
memory_usage = (stats['memory_stats']['usage'] - stats['memory_stats']['stats']['cache'])/ (1024 * 1024)
```

También cabe destacar que pasé harto tiempo aprendiendo el uso de Hooks y Context en React, ya que me gusta bastante el approach que ocupan, ya que los Hook intentan resolver bastantes problemas que tenía React, sobre todo con relación a la legibilidad del código.

**Ninguna Clase, LifeCycle Method (componentDidUpdate, componentDidMount, etc ), ni HOC ( connect()(Component), withStyles(styles)(component) ) fueron utilizados, lo cual a la larga puede llegar a mejorar bastante el DX.**

# Resultados

Se logró exitosamente implementar un dashboard que muestre las métricas en tiempo real de los contenedores de Docker corriendo en el sistema, utilizando como herramientas principales Rails, React y Traefik.
Si se monitoriza el request que se hace al endpoint del websocket, en la pestaña Networks -> websocket -> Messages del Chrome Dev Console, se puede apreciar que los mensajes recibidos son exactamente cada 10 segundos y algunos milisegundos que se demora en consultar la información del cache y transportar la información.

## TODO

- Refactorizar algunos componentes y funciones del frontend que no siguen el patrón de diseño que se está implementando (crear mas hooks, como por ejemplo useStore() para utilizar el store sin necesidad de utilizar useContext(StoreContext) ).
- Atajar algunas excepciones que se pasaron por alto en el frontend y backend.
