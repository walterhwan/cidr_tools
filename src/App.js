import React from 'react'
import ipRegex from 'ip-regex'
import PropTypes from 'prop-types'

import { Netmask4 } from './netmask46'
import './App.css'

const DEFAULT_CIDR = '192.168.0.37/30'

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
  let block
  let errorMessage
  if (cidr) {
    try {
      block = new Netmask4(cidr)
    } catch (err) {
      errorMessage = err.message
      errorCallBack(err)
    }
  }
  if (block) {
    return {
      ipRangeData: {
        'CIDR Range': block.cidr,
        'Net Mask': block.netmask,
        'Host Mask': block.hostmask,
        'First IP': block.first,
        'Last IP': block.last,
        'Total Hosts': block.size,
      },
      binaryData: {
        'Base IP': ipv4ToBinary(block.ip),
        'Net Mask': ipv4ToBinary(block.netmask),
        'First IP': ipv4ToBinary(block.first),
        'Host Mask': ipv4ToBinary(block.hostmask),
        'Last IP': ipv4ToBinary(block.last),
      },
    }
  }
  return {
    ipRangeData: {},
    binaryData: {},
    errorMessage,
  }
}

function CidrRange({ ipRangeData = {} }) {
  return (
    <div className="cidr-output">
      {Object.entries(ipRangeData).map(([key, val]) => (
        <div className="output-row" key={key}>
          <div className="output-left">{`${key}:`}</div>
          <div className="output-right">{val}</div>
        </div>
      ))}
    </div>
  )
}
CidrRange.propTypes = {
  ipRangeData: PropTypes.object,
}

function BinaryExplained({ binaryData = {} }) {
  return (
    <React.Fragment>
      <div className="title">
        <p>In Binary</p>
      </div>
      <div className="cidr-output">
        {Object.entries(binaryData).map(([key, val]) => (
          <div className="output-row" key={key}>
            <div className="output-left">{`${key}:`}</div>
            <div className="output-binary-right">{val}</div>
          </div>
        ))}
      </div>
      <div className="cidr-output">
        <p>{'<Base IP> BITWISE AND <Net Mask> = <First IP>'}</p>
        <p>{'<First IP> BITWISE OR <Host Mask> = <Last IP>'}</p>
      </div>
    </React.Fragment>
  )
}
BinaryExplained.propTypes = {
  binaryData: PropTypes.object,
}

function App() {
  const [inputBox, setInputBox] = React.useState(DEFAULT_CIDR)
  const [cidr, setCidr] = React.useState(inputBox)
  const [errorText, setErrorText] = React.useState('')

  const handleChange = (event) => {
    const value = event.target.value
    const [ip, bitmask] = value.split('/')
    const isIpv4 = ipRegex({ exact: true }).test(ip)

    if (isIpv4 && bitmask) setCidr(value)
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
        <p>CIDR To IP Range Explained</p>
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
        <React.Fragment>
          <CidrRange {...{ ipRangeData }} />
          <BinaryExplained {...{ binaryData }} />
        </React.Fragment>
      )}
    </div>
  )
}

export default App
