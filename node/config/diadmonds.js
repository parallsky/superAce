let tmp = {
  11: 10,
  12: 100,
  13: 200,
  14: 500,
  15: 1000,
  16: 2000,
  17: 3000,
  18: 5000,
  19: 10000
}
let diamondList = []

for(let key in tmp) {
  let id = parseInt(key)
  let item = {
    id: id,
    mount: tmp[id],
    price: tmp[id]/5
  }
  if(id == 14) {
    item.price = item.price * 0.90
  } else if(id > 14) {
    item.price = item.price * 0.8
  }

  diamondList.push(item)
}


module.exports = diamondList
