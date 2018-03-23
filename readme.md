This node app is built to the spec:

Generate a new random hash each second.

Once per minute build a Merkle tree of those hashes and submit the Merkle root to Tierion

Retrieve the Calendar Chainpoint proof for that root when ready

Verify the proof using local or remote API calls and output the JSON representation of the proof to the console



clone the repo then:

```npm i```

```node app.js```
