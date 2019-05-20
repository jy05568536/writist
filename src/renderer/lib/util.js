const parseDom = (arg) => {
  var objE = document.createElement('div')
  objE.innerHTML = arg
  return objE
}
const util = {
  parseDom
}

export default util
