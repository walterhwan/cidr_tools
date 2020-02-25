import React from 'react'
import ipRegex from 'ip-regex'

import { Netmask4 } from './netmask46'
import './App.css'

const DEFAULT_CIDR = '192.168.0.37/30'

function ipv4ToBinary(ip) {
  return ip
    .split('.')
    .map((dec) => {
      return Number(dec)
        .toString(2)
        .padStart(8, '0')
    })
    .join(' ')
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

  // render output
  let outputObj = {}
  let binaryObj = {}
  function renderOutput() {
    if (cidr) {
      try {
        const block = new Netmask4(cidr)
        outputObj = {
          'CIDR Range': block.cidr,
          'Net Mask': block.netmask,
          'Host Mask': block.hostmask,
          'First IP': block.first,
          'Last IP': block.last,
          'Total Hosts': block.size,
        }
        // binary
        binaryObj = {
          'Base IP': ipv4ToBinary(block.ip),
          'Net Mask': ipv4ToBinary(block.netmask),
          'Host Mask': ipv4ToBinary(block.hostmask),
          'First IP': ipv4ToBinary(block.first),
          'Last IP': ipv4ToBinary(block.last),
        }
      } catch (err) {
        setCidr()
        setErrorText(err.message)
      }
    }
  }
  renderOutput()

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
      {/* IP Output */}
      <div className="cidr-output">
        {cidr ? (
          Object.entries(outputObj).map(([key, val]) => (
            <div className="output-row" key={key}>
              <div className="output-left">{`${key}:`}</div>
              <div className="output-right">{val}</div>
            </div>
          ))
        ) : (
          <div className="cidr-output">
            <div className="cidr-error">
              <p>{errorText}</p>
            </div>
          </div>
        )}
      </div>
      {/* Binary */}
      <div className="title">
        <p>In Binary</p>
      </div>
      <div className="cidr-output">
        {!!cidr &&
          Object.entries(binaryObj).map(([key, val]) => (
            <div className="output-row" key={key}>
              <div className="output-left">{`${key}:`}</div>
              <div className="output-binary-right">{val}</div>
            </div>
          ))}
      </div>

      <div className="cidr-output">
        <p>{'<IP> AND <Net Mask> => <First IP>'}</p>
        <p>{'<First IP> OR <First IP> => <Last IP>'}</p>
      </div>
    </div>
  )
}

export default App
