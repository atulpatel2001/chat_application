import SockJS from "sockjs-client";
import { Client, IMessage, StompHeaders } from "@stomp/stompjs";

export default class StompClientUtil {
  private stompClient: Client;
  private socketUrl: string;

  constructor(socketUrl: string) {
    this.socketUrl = socketUrl;
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.socketUrl),
      // debug: (msg: string) => console.log(msg),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
  }

  connect(onConnect: () => void, onError: (error: any) => void) {
    this.stompClient.onConnect = () => {
      console.log("✅ STOMP Connected");
      onConnect();
    };

    this.stompClient.onStompError = (frame) => {
      console.error("❌ STOMP Error:", frame);
      onError(frame);
    };

    this.stompClient.activate();
  }

  // Subscribe to the specific user's queue
  subscribeToUserQueue(userQueueDestination: string, callback: (message: IMessage) => void) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.warn("⚠️ STOMP client is not connected yet. Retrying...");
      setTimeout(() => this.subscribeToUserQueue(userQueueDestination, callback), 1000);
      return;
    }

    this.stompClient.subscribe(userQueueDestination, (message) => {
      console.log(message+"GET MESSAGE")
      callback(JSON.parse(message.body)); // Handle the message here
    });
  }

  sendMessage(destination: string, payload: object, headers: StompHeaders = {}) {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination,
        headers,
        body: JSON.stringify(payload),
      });
    } else {
      console.warn("STOMP client is not connected. Retrying...");
      setTimeout(() => this.sendMessage(destination, payload, headers), 1000);
    }
  }

  isAnyOneIsTyping(destination: string, payload: object, headers: StompHeaders = {}) {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination,
        headers,
        body: JSON.stringify(payload),
      });
    } else {
      console.warn("STOMP client is not connected. Retrying...");
      setTimeout(() => this.sendMessage(destination, payload, headers), 1000);
    }
  }


  subscribeForTyping(userQueueDestination: string, callback: (message: IMessage) => void) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.warn("⚠️ STOMP client is not connected yet. Retrying...");
      setTimeout(() => this.subscribeToUserQueue(userQueueDestination, callback), 1000);
      return;
    }

    this.stompClient.subscribe(userQueueDestination, (message) => {
      console.log(message+"GET MESSAGE")
      callback(JSON.parse(message.body)); // Handle the message here
    });
  }

  isConnected(): boolean {
    return this.stompClient.active;
  }
  disconnect() {
    this.stompClient.deactivate();
    console.log("Disconnected from STOMP");
  }
}
