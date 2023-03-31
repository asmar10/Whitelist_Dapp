import './App.css';
import { useEffect, useState } from 'react';
import { abi, contractAddress } from './constants';
// import { Contract, ethers } from "ethers"
const ethers = require("ethers")

function App() {
  const [numberOfWhitelisted, setNumberOfWhiteListed] = useState(0)
  const [currentAccount, setCurrentAccount] = useState(null)
  const [isLoading, setLoading] = useState(false)
  // let contract;

  async function getProviderorSigner(needSigner = false) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      if (needSigner) {
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        return contract;
      }
      const contract = new ethers.Contract(contractAddress, abi, provider)
      return contract;

    } catch (err) {
      // console.log(err)
      throw new Error(err)

    }
  }

  async function getMaxWhitelistedUsers() {
    try {
      const temp = await getProviderorSigner()
      const _getMaxWhitelistedUsers = await temp.maxWhitelistedAddresses()
      // console.log(_getMaxWhitelistedUsers, "max")
      return _getMaxWhitelistedUsers;
    } catch (err) {
      // console.log(err)
      throw new Error(err)
    }
  }

  async function currentWhitelistedUsers() {
    try {
      const temp = await getProviderorSigner()
      const current = await temp.numAddressesWhitelisted();
      console.log(current, "current")
      setNumberOfWhiteListed(current)
      // console.log(current, "current")
      return current
    } catch (err) {
      // console.log(err)
      throw new Error(err)
    }
  }

  async function isLimitReached() {
    try {
      const current = await currentWhitelistedUsers();
      const max = await getMaxWhitelistedUsers()
      // console.log(max, current)
      if (current < max) {
        // console.log(false, "limit")
        return false;
      }
      else {
        // console.log(true, "limit")
        return true;
      }
    } catch (err) {
      // console.log(err)
      throw new Error(err)
    }
  }

  async function isAlreadyMember() {
    try {
      const temp = await getProviderorSigner()
      const isMember = await temp.whitelistedAddresses(currentAccount)
      return isMember;
    } catch (err) {
      // console.log(err)
      throw new Error(err)
    }
  }

  async function enterWhiteList() {
    try {
      const temp1 = await isAlreadyMember()
      const temp2 = await isLimitReached()
      // console.log(temp1, temp2)
      if (temp1 == true) {
        alert("Already a member")
        throw new Error()

      }
      else if (temp2 == true) {
        alert("Limit Reached")
        throw new Error()

      }
      else {
        const temp = await getProviderorSigner(true)
        const res = await temp.addAddressToWhitelist()
        const temp2 = await currentWhitelistedUsers()
        // console.log(temp2)
        return res;
      }
    } catch (err) {
      // console.log(err)
      throw new Error(err)
    }
  }

  const handleClick = async () => {
    try {
      setLoading(true)
      await enterWhiteList();
      setTimeout(async function () {
        const a = await currentWhitelistedUsers()
        // Code to be executed after a delay of 2 seconds
        alert("Added")
        setLoading(false)
      }, 2000);
      // window.location.reload()

    } catch (err) {
      setLoading(false)
    }
  }

  async function connectWallet() {
    try {
      if (window.ethereum) {
        const account = await window.ethereum.request({
          method: "eth_requestAccounts"
        })
        setCurrentAccount(account[0])
      }
      else {
        throw new Error(Error)
      }
    } catch (err) {
      console.log(err)
    }

  }

  async function isWalletConnected() {
    try {
      const account = await window.ethereum.request({
        method: "eth_accounts"
      })
      // console.log("HEHEH")
      if (account.length > 0) {
        setCurrentAccount(account[0])
      }

    } catch (err) {
      console.log(err)
    }

  }

  async function walletDisconnected() {
    try {
      const account = await window.ethereum.request({
        method: "eth_accounts"
      })
      if (account.length == 0) {
        setCurrentAccount(null)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function handleAccountChange(address) {
    setCurrentAccount(address)
  }

  window.ethereum.on('accountsChanged', (address) => {
    handleAccountChange(address)
  })

  window.ethereum.on('chainChanged', () => {
    window.location.reload()

  })

  useEffect(() => {
    isWalletConnected()
    walletDisconnected()
    currentWhitelistedUsers()

  }, [currentAccount, currentWhitelistedUsers])


  return (
    <div>
      {currentAccount ?? <button onClick={connectWallet}>connect wallet</button>}

      <div className="main">
        <div>
          <h1 className="title">Welcome to Crypto Devs!</h1>
          <div className="description">
            {/* Using HTML Entities for the apostrophe */}
            It&#39;s an NFT collection for developers in Crypto.
          </div>
          <div className="description">
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {isLoading ? "Adding..." : <button onClick={handleClick}>Enter</button>}

        </div>
        <div>
          <img className="image" src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className="footer">
        Whitelist Dapp - Asmar
      </footer>
    </div>
  )
}

export default App;
