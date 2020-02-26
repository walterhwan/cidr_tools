const {
  longToIp,
  ipTolong,
  bigintToIpv6,
  ipv6ToBigint,
} = require('./helper')

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
      this.netLong = (ipTolong(ip) & this.maskLong) >>> 0
    } catch (err) {
      throw new Error(`Invalid ip address: ${ip}`)
    }

    this.ip = ip
    this.cidr = `${ip}/${this.bitmask}`
    this.size = Math.pow(2, 32 - this.bitmask)
    this.netmask = longToIp(this.maskLong)

    // The host netmask, the opposite of the netmask (eg.: 0.0.0.255)
    this.hostmask = longToIp(~this.maskLong)

    this.first = longToIp(this.netLong)
    this.last = longToIp(this.netLong + this.size - 1)
  }

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
        (ipTolong(ip) & this.maskLong) >>> 0 ===
        (this.netLong & this.maskLong) >>> 0
      )
    }
  }

  next(count) {
    if (count == null) {
      count = 1
    }
    return new Netmask4(
      longToIp(this.netLong + this.size * count),
      this.bitmask
    )
  }

  forEach(fn) {
    let long = ipTolong(this.first)
    const lastLong = ipTolong(this.last)
    let index = 0
    while (long <= lastLong) {
      fn(longToIp(long), long, index)
      index++
      long++
    }
  }

  toString() {
    return this.first + '/' + this.bitmask
  }
}

export class Netmask6 {
  constructor(ipv6, netmask) {
    if (typeof ipv6 !== 'string') {
      throw new Error('Missing ip')
    }
    if (!netmask) {
      [ipv6, netmask] = ipv6.split('/', 2)
    }
    if (!netmask) {
      throw new Error(`Invalid ip address: ${ipv6}`)
    }

    this.cidr = `${ipv6}/${netmask}`
  }
}

