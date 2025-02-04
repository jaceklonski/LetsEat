"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import mqtt from "mqtt";
import NavigationClient from "@/components/NavigationClient";

export default function UserOrderChatPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");

  const topic = `chat/order/${orderId}`;

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
      const data = await res.json();
      const historyStrings = data.map((msg) => `${msg.senderRole}: ${msg.content}`);
      setMessages(historyStrings);
    } catch (err) {
      console.error("History load error:", err);
    }
  }

  useEffect(() => {
    if (orderId) {
      fetchHistory();
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    if (typeof window === "undefined") return;

    const mqttClient = mqtt.connect("ws://localhost:9001", {
      clientId: `user_${orderId}_${Math.random().toString(16).slice(2)}`,
    });

    mqttClient.on("connect", () => {
      console.log("[USER] Connected to MQTT broker");
      mqttClient.subscribe(topic, (err) => {
        if (err) console.error("Subscribe error:", err);
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

  const sendMessage = async () => {
    if (!client || !inputVal.trim()) return;

    const mqttMessage = `USER: ${inputVal}`;
    client.publish(topic, mqttMessage);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      const res = await fetch(`/api/orders/${orderId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: inputVal }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save message");
      }
    } catch (err) {
      console.error("Save message error:", err);
    }

    setInputVal("");
  };

  return (
    <>
    <NavigationClient/>
    <div className="content">
    <div className="window">
      <h4>User Chat – Order: {orderId}</h4>
      <div className="chat">
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
      <div className="container2">
        <input
        className="input2"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          placeholder="Type a message..."
        />
        <button className="button2" onClick={sendMessage}>Send</button>
      </div>
    </div>
    </div>
    </>
  );
}
