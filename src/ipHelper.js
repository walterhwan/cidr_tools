const { Netmask } = require('./netmask46')

const cidrs = [
  '192.168.0.1/30',
  '10.0.0.1/30',
]
cidrs.forEach((cidr) => {
  const block = new Netmask(cidr)
  console.log(block)
})
// const {
//   first: firstIp,
//   last: lastIp,
//   size: totalHosts,
//   mask: netmask,
// } = block

// const result = {
//   firstIp,
//   lastIp,
//   totalHosts,
//   netmask,
// }
// console.log(result)
