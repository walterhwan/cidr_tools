import React from 'react'
import PropTypes from 'prop-types'


export default function CidrRange({ ipRangeData = {} }) {
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
