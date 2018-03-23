const axios = require('axios');
const _ = require('underscore');
const axiosThrottled = _.throttle(axios, 1001);
// console.log('_.THROTTLE', _.throttle)
const url = 'https://api.github.com';
module.exports = {
  getPublicRepos(since) {
    console.log('asdf');
    return axiosThrottled({method: 'GET', url: url + '/repositories'})
      .then(resp => resp.data)
      .catch(e => console.error(e.data));
  },
  getRepoCommits(commits_url) {
    return axiosThrottled({method: 'GET', url: commits_url}).then(
      resp => resp.data,
    );
  },
};
