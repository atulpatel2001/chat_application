import SockJS from "sockjs-client";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
let baseUrl="http://localhost:8081/chat-websocket";

export default class StompClientUtil {
    private stompClient: Client;
    private socketUrl: string;
    private subscriptions: StompSubscription[] = [];
  
    constructor(socketUrl: string) {
      this.socketUrl = socketUrl;
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(this.socketUrl),
        debug: (msg: string) => console.log(msg),
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
      
  
    subscribe(destination: string, callback: (message: IMessage) => void) {
        if (!this.stompClient || !this.stompClient.connected) {
          console.warn("⚠️ STOMP client is not connected yet. Retrying...");
          setTimeout(() => this.subscribe(destination, callback), 1000); // Retry after 1 second
          return;
        }
      
        this.stompClient.subscribe(destination, (message) => {
          callback(JSON.parse(message.body));
        });
      }
  
    sendMessage(destination: string, payload: object) {
        if (this.stompClient && this.stompClient.active) {
          this.stompClient.publish({
            destination,
            body: JSON.stringify(payload),
          });
        } else {
          console.warn("STOMP client is not connected. Unable to send message.");
        }
      }
      
  
    disconnect() {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
      this.stompClient.deactivate();
      console.log("Disconnected from STOMP");
    }
  }