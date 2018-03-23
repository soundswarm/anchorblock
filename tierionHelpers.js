import MerkleTools from 'merkle-tools';
const merkleTools = new MerkleTools(); // treeOptions is optional
import chp from 'chainpoint-client';
console.log('CHP', chp);

const leafInterval = 1000; //miliseconds
const numOfLeaves = 5; //merkle tree leaves

const addToChainpoint = async hash => {
  try {
    // Submit each hash to three randomly selected Nodes
    const proofHandles = await chp.submitHashes([hash]);
    return proofHandles;
  } catch (e) {
    console.error('chainpointError addToChainpoint', e);
  }
};

const getProofs = async proofHandles => {
  try {
    // Retrieve a Calendar proof for each hash that was submitted
    let proofs = await chp.getProofs(proofHandles);
    return proofs;
  } catch (e) {
    console.error('chainpointError getProofs', e);
  }
};

const verifyProofs = async proofs => {
  try {
    // Verify every anchor in every Calendar proof
    let verifiedProofs = await chp.verifyProofs(proofs);
    return verifiedProofs;
  } catch (e) {
    console.error('chainpointError verifyProofs', e);
  }
};

module.exports = {
  addLeafPerSec: data => {
    merkleTools.resetTree();
    let count = 0;
    const addLeaf = async () => {
      merkleTools.addLeaf(data, true);
      count++;
      if (count >= numOfLeaves) {
        // Once per minute build a Merkle tree of those hashes and submit the Merkle root to Tierion
        return Promise.resolve(merkleTools);
      }
      await new Promise(resolve => setTimeout(resolve, leafInterval));
      return addLeaf();
    };
    return addLeaf();
  },
  addLeaves: array => {
    merkleTools.resetTree();
    merkleTools.addLeaves(array, true);
    return merkleTools;
  },
  sendTreeToChainpoint: async merkleTools => {
    const doubleHash = false;
    merkleTools.makeTree(doubleHash);
    const isReady = merkleTools.getTreeReadyState();

    if (isReady) {
      const rootValueBuffer = merkleTools.getMerkleRoot();
      const rootValueString = rootValueBuffer.toString('hex');

      // add root to chainpoint
      const proofHandles = await addToChainpoint(rootValueString);

      // Retrieve the Calendar Chainpoint proof for that root when ready
      // Wait for Calendar proofs to be available
      await new Promise(resolve => setTimeout(resolve, 14000));
      const proofs = await getProofs(proofHandles);
      const verifiedProofs = await verifyProofs(proofs);
      console.log('VERIFIEDPROOFS', verifiedProofs);
      return verifiedProofs;
    }
  },
};
