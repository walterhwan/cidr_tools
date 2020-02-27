import React from 'react'
import ipRegex from 'ip-regex'

import { Netmask4, Netmask6 } from './netmask46'
import DataTable from './DataTable'
import BinaryExplained from './BinaryExplained'

import './App.css'

const DEFAULT_CIDR = '192.168.0.5/31'

function decimalToBinary(dec) {
  return Number(dec)
    .toString(2)
    .padStart(8, '0')
}

function ipv4ToBinary(ip) {
  return ip
    .split('.')
    .map(decimalToBinary)
    .join(' ')
}

function cidrToDisplay(cidr, errorCallBack) {
  if (!cidr) return {}
  let block
  let errorMessage
  let version
  if (cidr) {
    try {
      const [ip] = cidr.split('/')
      if (ipRegex.v6({ exact: true }).test(ip)) {
        block = new Netmask6(cidr)
      } else {
        block = new Netmask4(cidr)
        version = 4
      }
    } catch (err) {
      errorMessage = err.message
      errorCallBack(err)
    }
  }
  if (block) {
    const res = {
      ipRangeData: {
        'CIDR Range': block.cidr,
        'Net Mask': block.netmask,
        'Host Mask': block.hostmask,
        'First IP': block.first,
        'Last IP': block.last,
        'Total Hosts': block.size,
      },
    }
    if (version === 4) {
      res.binaryData = {
        'Base IP': ipv4ToBinary(block.ip),
        'Net Mask': ipv4ToBinary(block.netmask),
        'First IP': ipv4ToBinary(block.first),
        'Host Mask': ipv4ToBinary(block.hostmask),
        'Last IP': ipv4ToBinary(block.last),
      }
    }
    return res
  }
  return {
    ipRangeData: {},
    binaryData: {},
    errorMessage,
  }
}

function App() {
  const [inputBox, setInputBox] = React.useState(DEFAULT_CIDR)
  const [cidr, setCidr] = React.useState(inputBox)
  const [errorText, setErrorText] = React.useState('')
  const [isIpv6, setIsIpv6] = React.useState(ipRegex.v6({ exact: true }).test(DEFAULT_CIDR))

  const handleChange = (event) => {
    const value = event.target.value
    const [ip, bitmask] = value.split('/')
    const isIpv4 = ipRegex({ exact: true }).test(ip)
    setIsIpv6(ipRegex.v6({ exact: true }).test(ip))

    if (isIpv6 && bitmask) setCidr(value)
    else if (!isIpv6 && isIpv4 && bitmask) setCidr(value)
    else setCidr()

    setInputBox(value)
    setErrorText('')
  }

  const handleError = (err) => {
    setCidr()
    setErrorText(err.message)
  }

  const { ipRangeData, binaryData } = cidrToDisplay(cidr, handleError)

  return (
    <div className="App">
      {/* Title */}
      <div className="title">
        <p>CIDR To IP Range</p>
      </div>
      {/* IP Input */}
      <input
        className="cidr-input"
        autoFocus
        type="text"
        value={inputBox}
        onChange={handleChange}
      />
      {/* Data/Error */}
      {!cidr ? (
        <div className="cidr-error">
          <p>{errorText}</p>
        </div>
      ) : (
        <>
          <DataTable isIpv6 data={ipRangeData} />
          {!isIpv6 && <BinaryExplained {...{ binaryData }} />}
        </>
      )}
    </div>
  )
}

export default App
