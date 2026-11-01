import adapter from '@sveltejs/adapter-static';

const base = process.env.BASE_PATH || '';

export default {
  kit: {
    adapter: adapter({ pages: 'build', assets: 'build', strict: true }),
    paths: { base },
  },
};



