import {Button, Form} from 'semantic-ui-react';
import React, {Component} from 'react';
import {getRepoCommits} from '../githubHelpers';
import {addLeaves, sendTreeToChainpoint} from '../tierionHelpers';
let chp;
let jsonMarkup;

class Index extends Component {
  state = {
    url: '',
    verifiedProofs: '',
    loading: false,
    countDown: 14,
  };
  componentDidMount() {
    // this loads only on the client side
    chp = require('../node_modules/chainpoint-client/dist/bundle.web.js');
    jsonMarkup = require('json-markup');

  }
  parseUrl = url => {
    const cleanUrl = url.replace('https://github.com/', '');
    return cleanUrl.split('/');
  };
  countDown = async () => {
    let count = this.state.countDown;
    while (count >= 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      count--;
      this.setState({countDown: count});
    }
  };
  anchorReopoCommits = async url => {
    this.setState({loading: true});
    this.countDown();
    const user = this.parseUrl(url)[0];
    const repo = this.parseUrl(url)[1];
    const commits_url = `https://api.github.com/repos/${user}/${repo}/commits`;
    const commits = await getRepoCommits(commits_url);
    const merkleTools = addLeaves(commits, chp);
    const verifiedProofs = await sendTreeToChainpoint(merkleTools, chp);
    this.setState({verifiedProofs, countDown: 14, loading: false});
  };
  render() {
    return (
      <div>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
        />
        <Form>
          <Form.Field>
            <h3>Input the url of an open source github repo to anchor the repo's commits to a blockchain</h3>
            <input
              placeholder="Repo url"
              onChange={e => {
                this.setState({url: e.target.value});
              }}
            />
          </Form.Field>
          <Button onClick={() => this.anchorReopoCommits(this.state.url)}>
            submit
          </Button>
        </Form>
        {this.state.loading
          ? <div>
              <h4>Verifying proofs</h4>
              {this.state.countDown}
            </div>
          : null}
        {this.state.verifiedProofs
          ? <div>
              <h4>Verified Proofs:</h4>
              <pre>{JSON.stringify(this.state.verifiedProofs, null, 2)}</pre>
            </div>
          : null}
      </div>
    );
  }
}

export default Index;
