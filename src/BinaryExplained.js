import React from 'react'
import PropTypes from 'prop-types'


export default function BinaryExplained({ binaryData = {} }) {
  return (
    <>
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
    </>
  )
}
BinaryExplained.propTypes = {
  binaryData: PropTypes.object,
}