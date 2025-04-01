# Chat Application

This project is a **real-time chat application** that allows users to:
- **Add contacts** and chat if they are registered on the platform.
- **Participate in group chats**.
- **Ensure secure authentication and messaging** using **OAuth 2.0, WebSockets, and Apache Kafka**.

## **Tech Stack**
### **Backend** (Spring Boot & PostgreSQL)
- **Spring Boot** - Backend framework
- **Spring Security** - Authentication and Authorization
- **OAuth 2.0** - User authentication
- **WebSocket** - Real-time messaging
- **Apache Kafka** - Message streaming
- **PostgreSQL** - Database storage

### **Frontend** (Next.js)
- **Next.js** - React-based frontend framework
- **WebSocket Integration** - For real-time communication
- **OAuth 2.0** - Secure authentication

## **Features**
- **User Authentication & Authorization** using **OAuth 2.0**
- **Contact Management**: Add contacts and check if they are registered
- **One-on-One Chat**: Secure direct messaging
- **Group Chat**: Users can create and participate in group conversations
- **Message Status**: Sent, Delivered, Read indicators
- **Real-time Messaging** using **WebSockets & Kafka**
- **Database Storage**: PostgreSQL for storing user and chat data

## **Installation & Setup**

### **Prerequisites**
- Java 17+
- Node.js & npm
- PostgreSQL Database
- Docker (for Kafka setup)

### **Clone the Repository**
```sh
git clone https://github.com/your-repo/chat-application.git
cd chat-application
```

### **Backend Setup**
#### **Database Configuration**
Modify `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/chatdb
spring.datasource.username=postgres
spring.datasource.password=yourpassword
```

#### **Apache Kafka Installation**
1. **Download Kafka**
   ```sh
   wget https://downloads.apache.org/kafka/3.5.0/kafka_2.13-3.5.0.tgz
   tar -xzf kafka_2.13-3.5.0.tgz
   cd kafka_2.13-3.5.0
   ```
2. **Start Zookeeper**
   ```sh
   bin/zookeeper-server-start.sh config/zookeeper.properties
   ```
3. **Start Kafka Broker**
   ```sh
   bin/kafka-server-start.sh config/server.properties
   ```
4. **Verify Installation**
   ```sh
   bin/kafka-topics.sh --list --bootstrap-server localhost:9092
   ```

#### **Run Kafka Using Docker**
```sh
docker-compose up -d
```

#### **Build & Run Backend**
```sh
mvn clean install
mvn spring-boot:run
```

### **Frontend Setup**
```sh
cd frontend
npm install
npm run dev
```

## **API Endpoints**
| HTTP Method | Endpoint | Description |
|------------|---------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and get token |
| `GET` | `/contacts` | List user contacts |
| `POST` | `/chat/send` | Send a message |
| `GET` | `/chat/history/{userId}` | Retrieve chat history |
| `POST` | `/group/create` | Create a new group |
| `POST` | `/group/add-user` | Add a user to a group |

## **WebSocket Integration**
- **WebSocket Endpoint:** `/ws/chat`
- Clients can subscribe to channels for real-time messaging.

## **Authentication Flow (OAuth 2.0)**
1. **User registers/logs in** and gets an **access token**.
2. Token is used for API requests and WebSocket connections.
3. **Spring Security** validates token before granting access.

## **Future Enhancements**
- **Push Notifications** for new messages
- **File Sharing** in chat
- **AI-based Chatbot** integration

This chat application ensures **secure, scalable, and real-time messaging** using **Kafka, WebSockets, and OAuth 2.0**. 🚀

