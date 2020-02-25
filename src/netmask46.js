const long2ip = function(long) {
  const a = (long & (0xff << 24)) >>> 24
  const b = (long & (0xff << 16)) >>> 16
  const c = (long & (0xff << 8)) >>> 8
  const d = long & 0xff
  return [a, b, c, d].join('.')
}

const ip2long = function(ip) {
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

export class Netmask4 {
  // input can be new Netmask4('10.0.0.1/32') or Netmask4('10.0.0.1', '32')
  constructor(ip, netmask) {
    if (typeof ip !== 'string') {
      throw new Error('Missing ip')
    }
    if (!netmask) {
      ;[ip, netmask] = ip.split('/', 2)
    }
    if (!netmask) {
      throw new Error(`Invalid ip address: ${ip}`)
    }

    if (netmask) {
      this.bitmask = parseInt(netmask, 10)
      this.maskLong = 0
      if (this.bitmask > 0) {
        this.maskLong = (0xffffffff << (32 - this.bitmask)) >>> 0
      }
    } else {
      throw new Error('Invalid netmask: empty')
    }
    
    if (isNaN(this.bitmask) || this.bitmask > 32 || this.bitmask < 0) {
      throw new Error(`Invalid netmask: ${netmask}`)
    }

    try {
      this.netLong = (ip2long(ip) & this.maskLong) >>> 0
    } catch (err) {
      throw new Error(`Invalid ip address: ${ip}`)
    }

    this.ip = ip
    this.cidr = `${ip}/${this.bitmask}`
    this.size = Math.pow(2, 32 - this.bitmask)
    this.netmask = long2ip(this.maskLong)

    // The host netmask, the opposite of the netmask (eg.: 0.0.0.255)
    this.hostmask = long2ip(~this.maskLong)

    this.first = long2ip(this.netLong)
    this.last = long2ip(this.netLong + this.size - 1)
  }

  // Returns true if the given ip or netmask is contained in the block
  contains(ip) {
    if (
      typeof ip === 'string' &&
      (ip.indexOf('/') > 0 || ip.split('.').length !== 4)
    ) {
      ip = new Netmask4(ip)
    }

    if (ip instanceof Netmask4) {
      return this.contains(ip.base) && this.contains(ip.last)
    } else {
      return (
        (ip2long(ip) & this.maskLong) >>> 0 ===
        (this.netLong & this.maskLong) >>> 0
      )
    }
  }

  next(count) {
    if (count == null) {
      count = 1
    }
    return new Netmask4(
      long2ip(this.netLong + this.size * count),
      this.bitmask
    )
  }

  forEach(fn) {
    let long = ip2long(this.first)
    const lastLong = ip2long(this.last)
    let index = 0
    while (long <= lastLong) {
      fn(long2ip(long), long, index)
      index++
      long++
    }
  }

  toString() {
    return this.first + '/' + this.bitmask
  }
}

// exports.ip2long = ip2long
// exports.long2ip = long2ip
// exports.Netmask4 = Netmask4

// class Netmask6 {
//   constructor(ipv6, netmask) {
//     if (typeof ipv6 !== 'string') {
//       throw new Error('Missing ip')
//     }
//     if (!netmask) {
//       ;[ipv6, netmask] = ipv6.split('/', 2)
//     }
//     if (!netmask) {
//       throw new Error(`Invalid ip address: ${ipv6}`)
//     }

//     this.cidr = `${ipv6}/${netmask}`
//   }
// }
