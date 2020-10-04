const {
  MD5,
  enc,
  AES,
  mode,
  pad
} = require("crypto-js")
const XLSX = require("xlsx")

function json2xlsx(json) {
  const sheet = XLSX.utils.json_to_sheet(json)
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, sheet, '导出记录')
  return XLSX.write(book, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'binary'
  })
}

function xlsx2json(xlsx) {
  const book = XLSX.read(xlsx, {
    type: 'binary'
  })
  const sname = book.SheetNames[0]
  return XLSX.utils.sheet_to_json(book.Sheets[sname])
}

function obj2md5(json) {
  return enc.Base64.stringify(MD5(JSON.stringify(json)))
}

function obj2aes(json, key) {
  const cKey = enc.Utf8.parse(key)
  return AES.encrypt(JSON.stringify(json), cKey, {
    iv: cKey,
    mode: mode.CBC,
    padding: pad.Pkcs7
  }).toString()
}

function aes2obj(jsonEnc, key) {
  const cKey = enc.Utf8.parse(key)
  const decData = AES.decrypt(jsonEnc, cKey, {
    iv: cKey,
    mode: mode.CBC,
    padding: pad.Pkcs7
  })
  const serialData = enc.Utf8.stringify(decData)
  return JSON.parse(serialData)
}

module.exports = {
  json2xlsx,
  xlsx2json,
  obj2md5,
  obj2aes,
  aes2obj
}