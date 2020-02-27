import React from 'react'
import ipRegex from 'ip-regex'

import { Netmask4, Netmask6 } from './netmask46'
import DataTable from './DataTable'
import BinaryExplained from './BinaryExplained'

import './App.css'

const DEFAULT_CIDR = '192.168.0.5/31'
const reIpv4mapped = /(?<=^::ffff:)((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])$/

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

const decimalToHex = (decimal) => {
  return parseInt(decimal, 10).toString(16)
}

const ipv4ToIpv4mappedIpv6Hex = (ivp4) => {
  const arr =  ivp4.split('.').map(decimalToHex)
  return `::ffff:${arr[0] + arr[1]}:${arr[2] + arr[3]}`
}

const isExactIpv6 = (string) => 
  ipRegex.v6({ exact: true }).test(string)

const isExactIpv4 = (string) => 
  ipRegex.v4({ exact: true }).test(string)

const isExactIpv4mapped = (string) => {
  return reIpv4mapped.test(string)
}

function cidrToDisplay(cidr, errorCallBack) {
  if (!cidr) return {}
  let block
  let errorMessage
  let version
  if (cidr) {
    try {
      const [ip] = cidr.split('/')
      if (isExactIpv6(ip)) {
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
  const [isIpv6, setIsIpv6] = React.useState(isExactIpv6(DEFAULT_CIDR))
  const [ipVersion, setIpVersion] = React.useState('IPv4')
  const [timer, setTimer] = React.useState()
  
  const handleChange = (event) => {
    const value = event.target.value
    const [_ip, bitmask] = value.split('/')
    let ip = _ip

    // deal with ipv4 mapped ipv6
    if (isExactIpv4mapped(_ip)) {
      const v4 = _ip.match(reIpv4mapped)[0]
      ip = ipv4ToIpv4mappedIpv6Hex(v4)
      setIpVersion('IPv4-Mapped IPv6')
      setIsIpv6(true)
      if (bitmask) setCidr(`${ip}/${bitmask}`)
    } else if (isExactIpv6(ip)) {
      if (bitmask) setCidr(`${ip}/${bitmask}`)
      setIsIpv6(true)
      setIpVersion('IPv6')
    } else if (isExactIpv4(ip)) {
      if (bitmask) setCidr(`${ip}/${bitmask}`)
      setIpVersion('IPv4')
    } else {
      setIpVersion()
      setCidr()
    }

    setInputBox(value)
    setErrorText('')
    
    // purge not allowed charactors
    const re = /[^/0-9a-fA-F:.]|(?<=\.)\.+|(?<=::):+/gm
    clearTimeout(timer)
    setTimer(setTimeout(() => {
      const newCidr = value.replace(re, '')
      setInputBox(newCidr)
      setCidr(newCidr)
    }, 2000))
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
      {ipVersion && <p>{`Detected IP version: ${ipVersion}`}</p>}
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
