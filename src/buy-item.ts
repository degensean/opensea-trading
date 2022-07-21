import { OpenSeaSDK, Network } from 'opensea-js'
import Web3ProviderEngine from 'web3-provider-engine'
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
import { PrivateKeyWalletSubprovider } from '@0x/subproviders'
import dotenv from 'dotenv';
dotenv.config()

const CHAIN : 'Rinkeby' | 'Main' = 'Rinkeby'
let chainId: number
let networkName: string
if (CHAIN == 'Rinkeby') {
  chainId = 4
  networkName = Network.Rinkeby
} else {
  chainId = 1
  networkName = Network.Main
}

const rpcSubprovider = new RPCSubprovider({rpcUrl: process.env.RINKEBY_URL})

const privateKeyWalletProvider = new PrivateKeyWalletSubprovider(process.env.PRIVATE_KEY!, chainId) // Must specify chainId

const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(privateKeyWalletProvider);
providerEngine.addProvider(rpcSubprovider);
providerEngine.start();

const openseaSDK = new OpenSeaSDK(providerEngine, {
  networkName: Network.Rinkeby,  // or Network.Main
  apiKey: process.env.OPENSEA_API
})

const accountAddress = 'xxxx'
const tokenAddress = 'xxxx'
const tokenId = 'xxxx'


async function getAsset() {
  const asset = await openseaSDK.api.getAsset({
    tokenAddress, // string
    tokenId, // string | number | null
  })
  console.log(asset)
}


async function buyItem() {
  const order = await openseaSDK.api.getOrderLegacyWyvern({
    side: 1,
    asset_contract_address: tokenAddress,
    token_id: tokenId,
  })
  console.log(order)
  const transactionHash = await openseaSDK.fulfillOrderLegacyWyvern({ order, accountAddress })
  console.log(transactionHash)
}

buyItem()
.catch(err => {
    console.log(err);
    process.exit(1);
})
.then(() => process.exit(0));