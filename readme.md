This node app:

Generate a new random hash each second.

Once per minute build a Merkle tree of those hashes and submit the Merkle root to Tierion anchoring API

Retrieve the Calendar Chainpoint proof for that root when ready

Verify the proof and output the JSON representation of the proof to the console



clone the repo then:

```npm i```

```node app.js```
