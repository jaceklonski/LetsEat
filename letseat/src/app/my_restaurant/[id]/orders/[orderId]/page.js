"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import mqtt from "mqtt";

export default function RestaurantOrderChatPage() {
  const { restaurantId, orderId } = useParams();
  const router = useRouter();

  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");

  // Topic MQTT – wspólny dla danego zamówienia
  const topic = `chat/order/${orderId}`;

  // Funkcja pobierająca historię wiadomości z bazy
  async function fetchHistory() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      const res = await fetch(`/api/orders/${orderId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load messages");
      }

      // Otrzymujemy tablicę obiektów z bazy, np.:
      // { id, senderRole, content, createdAt, ... }
      const data = await res.json();
      // Mapujemy na teksty: "RESTAURANT: Treść" lub "USER: Treść" – tutaj zachowujemy wartość z bazy
      const historyStrings = data.map((msg) => `${msg.senderRole}: ${msg.content}`);
      setMessages(historyStrings);
    } catch (err) {
      console.error("Fetch history error:", err);
    }
  }

  // Ładujemy historię przy montowaniu komponentu
  useEffect(() => {
    if (!orderId) return;
    fetchHistory();
  }, [orderId]);

  // Inicjalizacja MQTT i subskrypcja
  useEffect(() => {
    if (!orderId) return;
    if (typeof window === "undefined") return;

    const mqttClient = mqtt.connect("ws://localhost:9001", {
      clientId: `restaurant_${orderId}_${Math.random().toString(16).slice(2)}`,
    });

    mqttClient.on("connect", () => {
      console.log("[RESTAURANT] Connected to MQTT broker");
      mqttClient.subscribe(topic, (err) => {
        if (err) console.error("Subscription error:", err);
      });
    });

    mqttClient.on("message", (recvTopic, payload) => {
      if (recvTopic === topic) {
        setMessages((prev) => [...prev, payload.toString()]);
      }
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, [orderId, topic]);

  // Funkcja wysyłania wiadomości
  const sendMessage = async () => {
    if (!client || !inputVal.trim()) return;

    // Publikacja w MQTT – wysyłamy wiadomość z prefiksem "RESTAURANT: "
    const mqttMessage = `RESTAURANT: ${inputVal}`;
    client.publish(topic, mqttMessage);

    // Zapisujemy wiadomość w bazie przez POST
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      // Wysyłamy dodatkowo pole "role": "RESTAURANT", aby backend zapisał senderRole jako "RESTAURANT"
      const res = await fetch(`/api/orders/${orderId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: inputVal, role: "RESTAURANT" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save message");
      }
      // Nie aktualizujemy stanu – wiadomość pojawi się przez MQTT (oraz została zapisana w bazie)
    } catch (err) {
      console.error("Save message error:", err);
    }

    setInputVal("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Restaurant Chat – Restaurant: {restaurantId}, Order: {orderId}
      </h2>
      <div style={{ border: "1px solid #ccc", padding: 10, maxHeight: 200, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type a message..."
          style={{ width: "70%" }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 8 }}>
          Send
        </button>
      </div>
    </div>
  );
}
