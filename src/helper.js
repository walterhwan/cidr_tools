/* global BigInt */

const BIGINT_0 = BigInt(0)
const BIGINT_1 = BigInt(1)

export const longToIp = (long) => {
  const a = (long & (0xff << 24)) >>> 24
  const b = (long & (0xff << 16)) >>> 16
  const c = (long & (0xff << 8)) >>> 8
  const d = long & 0xff
  return [a, b, c, d].join('.')
}

export const bigintToIpv6 = (bigint) => {
  const ipv6Arr = []
  for (let i = BIGINT_0; i < BigInt(8); i++) {
    const shift = BigInt(112) - (BigInt(16) * i)
    ipv6Arr.push((bigint & (BigInt('0xffff') << shift)) >> shift)
  }

  return ipv6Arr.map((decimal) => decimal.toString(16)).join(':')
}

export const ipTolong = (ip) => {
  const b = ip.split('.')
  if (b.length === 0 || b.length > 4) {
    throw new Error('Invalid IP')
  }
  for (let i = 0; i < b.length; i++) {
    const byte = b[i]
    if (isNaN(parseInt(byte, 10))) {
      throw new Error(`Invalid byte: ${byte}`)
    }
    if (byte < 0 || byte > 255) {
      throw new Error(`Invalid byte: ${byte}`)
    }
  }
  return ((b[0] << 24) | (b[1] << 16) | (b[2] << 8) | b[3]) >>> 0
}

export const ipv6ToBigint = (ipv6) => {
  const arr = ipv6.split(':')
  if (arr.length !== 8) {
    throw new Error(`Invalid IPv6: ${ipv6}`)
  }

  const ipv6Arr = ipv6.split(':')
    .map((hexgroup) => {
      const decimal = parseInt(hexgroup, 16)
      if (isNaN(decimal)) throw new Error(`Invalid hexgroup: ${hexgroup}`)
      if (decimal < 0 || decimal > 65535) throw new Error(`Invalid hexgroup: ${hexgroup}`)
      return BigInt(decimal)
    })
  let temp = BIGINT_0
  ipv6Arr.forEach((group, idx) => {
    const shift = BigInt(112) - (BigInt(16) * BigInt(idx))
    temp |= (group << shift)
  })
  return temp >> BIGINT_0
}

export const printBigObj = (pojo) => {
  const newPojo = {}
  Object.entries(pojo).forEach(([key, val]) => {
    if (typeof val === "bigint") newPojo[key] = val.toString()
    else newPojo[key] = val
  })

  return newPojo
}

export const BigIntPow = (base, exp) => {
  if (exp === BIGINT_0) {
    return BIGINT_1
  } else if (exp === BIGINT_1) {
    return base
  } else if (exp < BIGINT_0) {
    return BIGINT_1 / BigIntPow(base, -exp)
  }

  return BigIntPow(base, exp - BIGINT_1) * BigIntPow(base, BIGINT_1)
}

export const unShortenIpv6 = (shortenedIpv6) => {
  const ipArr = shortenedIpv6.split('::')
  if (ipArr.length > 2) {
    throw new Error(`Invalid ipv6 address: ${shortenedIpv6}`)
  } else if (ipArr.length === 1) {
    return shortenedIpv6
  }
  const [left, right] = ipArr
  const leftIpArr = left.split(':')
  const rightIpArr = right.split(':')
  const leftLength = left ? leftIpArr.length : 0
  const rightLength = right ? rightIpArr.length : 0
  const hexGroupToAdd = 8 - leftLength - rightLength
  const ipv6Arr = [...leftIpArr, ...Array(hexGroupToAdd).fill('0'), ...rightIpArr]

  return ipv6Arr.filter((hex) => hex !== '').join(':')
}
