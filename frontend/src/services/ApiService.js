const API_URL = process.env.REACT_APP_API_URL;
console.log('envs', process.env);

const ApiService = {
  fetchContainers: async () => {
    try {
      const response = await fetch(`http://${API_URL}`);
      if (response.status !== 200) {
        console.log('error', response);
        return { status: 'error', response };
      } else {
        const data = await response.json();
        return { status: 'success', containers: data };
      }
    } catch (err) {
      return { status: 'error', response: err };
    }
  }
};

export default ApiService;
