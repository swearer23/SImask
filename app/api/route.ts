import { NextResponse, NextRequest } from 'next/server'
import { DEMO_SPI, maskCard } from '../misc/const'
import hmacSHA512 from 'crypto-js/hmac-sha512'
import Base64 from 'crypto-js/enc-base64'
import sha256 from 'crypto-js/sha256'
import sha512 from 'crypto-js/sha512'

// const SECRET = '123456'
const SECRET = 'b890e313d295f063ab2bc0dda8bc8a6dee111c2d7ed58b75d5147358d0fa0643af429372ca664a175635f5fb9cd278bb29f5cdd59cf0bbffb7a5fa162fd77ce6'

const verify = async (cnonce: string, timestamp: string, signature: string, isEdit: boolean = false, request: NextRequest|null = null) => {
  const ts = parseInt(timestamp)
  const uuid = cnonce.slice(0, 32)
  const publicFactor = cnonce.slice(32)
  const randomFactor = (Number(publicFactor) * 20201) % 10000000

  let hashDigest
  if (isEdit && request) {
    const { referer } = Object.fromEntries(request.headers)
    if (!referer) {
      return false
    }
    hashDigest = Base64.stringify(sha512(`${uuid}|${randomFactor}|${referer}|${ts}`))
    console.log(111, hashDigest, signature)
  } else {
    hashDigest = Base64.stringify(sha256(`${uuid}|${randomFactor}|${ts}`))
    console.log(222, hashDigest, signature)
  }

  const hmacDigest = Base64.stringify(hmacSHA512(hashDigest.toString(), SECRET));
  const v_signature = hmacDigest.toString()
    
  return v_signature === signature

}

const findPropByPath = (obj: any, path: string) => {
  const paths = path.split('.').filter(item => item.length)
  let result = obj
  for (const p of paths) {
    result = result[p]
  }
  return result
}

const isExpired = (timestamp: number|string) => {
  let ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
  const now = new Date().getTime()
  const diff = now - ts * 1000
  return diff > 1000 * 60 * 5
}

export async function GET(request: NextRequest) {
  const spi = JSON.parse(DEMO_SPI)
  if (request.headers.get('x-enigma-signature')) {
    const {
      'x-enigma-cnonce': cnonce,
      'x-enigma-signature': signature,
      'x-enigma-nodepath': nodepath,
      'x-enigma-timestamp': timestamp
    } = Object.fromEntries(request.headers)
  
    if (isExpired(timestamp)) return NextResponse.json({error: 'Signature Expired'}, {status: 401})
  
    let verified
    if (nodepath) {
      verified = await verify(cnonce, timestamp, signature)
    } else {
      verified = await verify(cnonce, timestamp, signature, true, request)
    }
    if (verified) {
      if (nodepath) {
        return NextResponse.json(findPropByPath(spi, nodepath))
      } else {
        return NextResponse.json(spi)
      }
    } else {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }
  } else {
    const matches = spi.phone.match(/(^\([0-9]{3}\)) ([0-9]{2,3})-([0-9]{3})/)
    matches[2] = '{{*???*}}'
    spi.phone = matches.slice(1).join(' ')
    spi.card = maskCard(spi.card, true)
    return NextResponse.json(spi)
  }
}
