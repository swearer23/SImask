'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import Kynareth from "fe-enigma-kynareth";

export default function Page() {

  const [name, setName] = useState('hello')
  const [phone, setPhone] = useState('')
  const [card, setCard] = useState('')
  const [eState, setEState] = useState(null)

  if (typeof window !== 'undefined') {
    global.__use_react__ = true
    const kynareth = new Kynareth()
    kynareth.setAdapter(axios)
    kynareth.setStateSetter(setEState)
  }

  useEffect(() => {
    axios.get('/api')
      .then(res => res.data)
      .then(data => {
        setName(data.name)
        setPhone(data.phone)
        setCard(data.card)
      })
  }, [])

  useEffect(() => {
    console.log(phone, eState)
  }, [eState])

  return (
    <div className="card card-side bg-base-100 shadow-xl mb-10">
      <figure><img src="/avatar.png" alt="Movie" /></figure>
      <div className="card-body">
        <h2 className="card-title">Key Account</h2>
        <p>Very important account</p>
        <p>Now at stage 2</p>
        <div className="flex"><div className="w-20">name:</div><div>{name.toString()}</div></div>
        <div className="flex"><div className="w-20">phone:</div><div>{phone.toString()}</div></div>
        <div className="flex"><div className="w-20">card no.:</div><div>{card.toString()}</div></div>
      </div>
    </div>
  )
}