import {Button, Form} from 'semantic-ui-react';
import React, {Component} from 'react';
import {getRepoCommits} from '../githubHelpers';
import {addLeaves, sendTreeToChainpoint} from '../tierionHelpers';
console.log('ADDLEAVES', addLeaves)

class Index extends Component {
  state = {
    url: '',
    verifiedProofs: '',
  };
  parseUrl = url => {
    const cleanUrl = url.replace('https://github.com/', '');
    console.log('CLEANURL', cleanUrl);
    return cleanUrl.split('/');
  };

  anchorReopoCommits = async url => {
    const user = this.parseUrl(url)[0];
    const repo = this.parseUrl(url)[1];
    const commits_url = `https://api.github.com/${user}/${repo}`;
    const commits = await getRepoCommits(commits_url);
    const merkleTools = addLeaves(commits);
    const verifiedProofs = await sendTreeToChainpoint(merkleTools);
    this.setState({verifiedProofs});
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
            Input the link
            <input
              placeholder="Repo"
              onChange={e => {
                this.setState({url: e.target.value});
              }}
            />
          </Form.Field>
          <Button onClick={() => this.anchorReopoCommits(this.state.url)}>
            submit
          </Button>
        </Form>
        <div>
          {this.state.verifiedProofs}
        </div>
      </div>
    );
  }
}

export default Index;
