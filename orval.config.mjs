export default {
  api: {
    input: 'http://localhost:3001/api-json/',
    output: {
      mode: 'tags-split',
      target: './src/api/',
      client: 'react-query',
    },
  },
}; 