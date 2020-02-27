import React from 'react'
import PropTypes from 'prop-types'
import DataTable from './DataTable'


export default function BinaryExplained({ binaryData = {} }) {
  return (
    <>
      <div className="title">
        <p>In Binary</p>
      </div>
      <DataTable data={binaryData}/>
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