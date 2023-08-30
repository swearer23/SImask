export const DEMO_SPI = `{
  "name": "@rower_activist_422",
  "phone": "(534) 118-8539",
  "card": "1234 5678 0023 4215"
}
`
export const DEMO_SPI_MASKED = `{
  "name": "John Doe",
  "email": "donotreveal@this.com"
}
`

export const maskCard = (card: string, apimode: boolean) => {
  const matches = card.match(/([0-9]{4}) ([0-9]{4}) ([0-9]{4}) ([0-9]{4})/)
  matches?.shift()
  if (matches && matches.length >= 4) {
    if (apimode) {
      matches[1] = '{{*????'
      matches[2] = '????*}}'
    } else {
      matches[1] = '****'
      matches[2] = '****'
    }
    return matches.join(' ')
  } else return card
}
