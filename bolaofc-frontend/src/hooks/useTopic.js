import { useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const WS_URL = API_URL.replace(/^http/, 'ws') + '/ws/websocket'

export function useTopic(topic, onMessage) {
  const handlerRef = useRef(onMessage)
  handlerRef.current = onMessage

  useEffect(() => {
    if (!topic) return

    const client = new Client({
      brokerURL: WS_URL,
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