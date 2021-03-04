class ApolloService {
  async executeQuery(query, variables, apolloClient, policy = "no-cache") {
    const client = window.$nuxt.$apolloProvider.clients.defaultClient;
    try {
      return await client.query({
        query,
        variables,
        fetchPolicy: policy,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new ApolloService();
