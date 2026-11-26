import { useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const API_URL = import.meta.env.VITE_API_URL

export function useTopic(topic, onMessage) {
  const handlerRef = useRef(onMessage)
  handlerRef.current = onMessage

  useEffect(() => {
    if (!topic) return

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_URL}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(topic, (msg) => {
          handlerRef.current(JSON.parse(msg.body))
        })
      },
    })

    client.activate()
    return () => client.deactivate()
  }, [topic])
}