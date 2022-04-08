import ReactMarkdown from 'react-markdown';

export default function About() {

  const md = `
  # zkPhoto: Private Authentic Photo Sharing

  ## Backstory

  This proposal aims to be a small stepping stone toward #2 of [Brian Gu’s Six ZK Moonshots](https://www.youtube.com/watch?v=c-nQx8peyKU). The idea is to have an on-chain data marketplace where users can trade private data, for example, “a high-res image that downsamples to a known low-res image”, using ZK. Within the scope of this proposal, the MVP is to implement a dApp that (0) use ZK to prove that the low-res image is downsized from an actual high-res image, (1) mint an NFT that contains the downsized image, *as well as the hash of the original image, (2) implement an in-browser camera for authentic on-chain photo-taking, and *(3) a marketplace providing secured transfer of the underlying full-res image.
  
  *=optional/nice to have

  💡 Github repos: [Backend](https://github.com/socathie/zkPhoto) | [Frontend](https://github.com/socathie/zkPhoto-ui)

  ## Phase 0: downsizing photo with ZKP

  MVP: a verifier contract that takes a private input of the fixed-size high-res image and outputs the low-res image *and the hash of the original image

  Input: an image of resolutions 1024x1024 in png format

  Output: a downsized image of resolutions 64x64 and the hash of the original image

  Requirements:

  - [x]  circuit to downsize a slice of the image and hash the slice
  private input: a bytes32 array of dimensions (256,256,3) that corresponds to the RGB values of 1/16 of the image of resolutions 1024x1024
  outputs: a bytes32 array of length 64 corresponding to the downsized image of resolutions 16x16 bundling every 4 pixels together +  a bytes 32 hash
  method: [bilinear interpolation](https://en.wikipedia.org/wiki/Bilinear_interpolation)
  - [x]  tests in hardhat to deploy and run the verifier contract
  - [x]  companion javascript to read image files to turn into input format and save output format into an image file

  Extensions:

  - [ ]  circuits that accept other image sizes

  ## Phase 1: NFT minting

  MVP: a smart contract that mints an NFT given the downsized image and *the hash of the high-res image

  Requirements of the zkPhoto smart contract

  - [x]  a method to mint a new NFT given a snarkjs proof from phase 0
  - [x]  a method to extract the low res image from the contract URI given an NFT id
  - [x]  a method to verify a local image is the original image of the corresponding NFT
  - [x]  a method to write string as a base 64 tokenURI
  - [x]  hardhat tests
  - [x]  avoid double minting of the same image
  - [ ]  reduce gas fee

  Extensions:

  - [ ]  a stateless version of the same contract

  ## Phase 2: on-chain photo taking

  MVP: an in-browser js camera that takes a photo then mints a zkPhoto NFT directly

  Requirement:

  - [ ]  an in-browser camera (frontend) that is connected to the backend from Phase 0 and Phase 1
  - [x]  a frontend to upload an image and (1) mint an NFT or (2) verify that it is the original image of the NFT
  - [x]  a frontend to display the low-res image of a given NFT id
  - [x]  a frontend to compare the image in tokenURI and the data within the contract

  ## Phase 3: secured transfer of private data

  TBC`;

  return (
    <ReactMarkdown children={md}/>
  );
}