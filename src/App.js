import React from 'react'
import ipRegex from 'ip-regex'

import { Netmask4 } from './netmask46'
import './App.css'

const DEFAULT_CIDR = '192.168.0.1/24'

function App() {
  const [inputBox, setInputBox] = React.useState(DEFAULT_CIDR)
  const [cidr, setCidr] = React.useState(inputBox)
  const [errorText, setErrorText] = React.useState('')

  const handleChange = event => {
    const value = event.target.value
    const [ip, bitmask] = value.split('/')
    const isIpv4 = ipRegex({ exact: true }).test(ip)
    if (isIpv4 && bitmask) setCidr(value)
    else setCidr()
    setInputBox(value)
    setErrorText('')
  }

  let textObj = {}
  if (cidr) {
    try {
      const block = new Netmask4(cidr)
      textObj = {
        'CIDR Range': block.cidr,
        'Net Mask': block.netmask,
        'First IP': block.first,
        'Last IP': block.last,
        'Total Hosts': block.size,
      }
    } catch (err) {
      setCidr()
      setErrorText(err.message)
    }
  }

  return (
    <div className="App">
      <div className="title">
        <p>CIDR To IP Range</p>
      </div>
      <input
        className="cidr-input"
        type="text"
        value={inputBox}
        onChange={handleChange}
      />
      <div className="cidr-output">
        {cidr ? (
          Object.entries(textObj).map(([key, val]) => (
            <div className="output-row" key={key}>
              <div className="output-left">{`${key}:`}</div>
              <div>{val}</div>
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
    </div>
  )
}

export default App
