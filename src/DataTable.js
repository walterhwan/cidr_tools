import React from 'react'
import PropTypes from 'prop-types'


export default function DataTable({ data = {} }) {
  return (
    <div className="cidr-output">
      {Object.entries(data).map(([key, val]) => (
        <div className="output-row" key={key}>
          <div className="output-left">{`${key}:`}</div>
          <div className="output-right">{val}</div>
        </div>
      ))}
    </div>
  )
}
DataTable.propTypes = {
  data: PropTypes.object,
}
