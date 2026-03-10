# MACMINICLAWS Backend API Reference

Base URL: `http://localhost:3001` (dev) or your deployed URL

## Public Endpoints (no auth)

### GET /
Backend info + social links.
```json
{
  "name": "MACMINICLAWS Backend",
  "version": "0.1.0",
  "network": { "chainId": 84532, "rpcUrl": "https://sepolia.base.org" },
  "social": {
    "x": "https://x.com/macminiclaws",
    "moltbook": "https://www.moltbook.com/u/macminiclaw"
  }
}
```

### GET /api/status
Health check.
```json
{
  "status": "ok",
  "network": { "chainId": 84532, "rpcUrl": "..." },
  "social": { "x": "...", "moltbook": "..." },
  "timestamp": 1234567890
}
```

### GET /api/nodes
List all active CLAW nodes.
```json
{
  "nodes": [
    {
      "id": "uuid",
      "nodeId": "claw-001",
      "walletAddress": "0x...",
      "hardwareSpec": "Mac Mini M2 Pro 16GB",
      "location": "Paris",
      "status": "idle",
      "cpuUsage": 23.5,
      "memoryUsage": 45.2,
      "computePower": 850,
      "lastHeartbeat": 1234567890,
      "registeredAt": 1234567890
    }
  ]
}
```

### GET /api/node/:nodeId
Get a single node by nodeId.
```json
{ "node": { ...same as above } }
```
Returns 404 if not found.

### GET /api/clusters
List all swarm clusters.
```json
{
  "clusters": [
    {
      "id": "uuid",
      "status": "active",
      "requiredCompute": 500,
      "createdAt": 1234567890,
      "nodes": [ ...node objects ]
    }
  ]
}
```

### POST /api/node/heartbeat
Node heartbeat (called every 30s by CLAW nodes).
```
Content-Type: application/json
```
Body:
```json
{
  "nodeId": "claw-001",
  "cpuUsage": 23.5,
  "memoryUsage": 45.2,
  "computePower": 850,
  "status": "idle"
}
```
Response: `200 { "node": {...} }`

---

## Authenticated Endpoints (wallet signature required)

### Auth Headers
All authenticated endpoints require these headers:
```
x-wallet-address: 0xYourWalletAddress
x-signature: 0x...signed message
x-timestamp: 1234567890
```

The message to sign is: `macminiclaw-auth:{timestamp}`
Timestamp must be within 5 minutes of server time.

### Frontend example (ethers.js v6):
```typescript
const timestamp = Date.now().toString();
const message = `macminiclaw-auth:${timestamp}`;
const signature = await signer.signMessage(message);

fetch('/api/node/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-wallet-address': address,
    'x-signature': signature,
    'x-timestamp': timestamp
  },
  body: JSON.stringify({ nodeId, hardwareSpec, location })
});
```

### POST /api/node/register
Register a new CLAW node.
```json
{
  "nodeId": "claw-001",
  "hardwareSpec": "Mac Mini M2 Pro 16GB",
  "location": "Paris, FR"
}
```
Response: `201 { "node": {...} }`

### POST /api/swarm/job
Submit a compute job. Auto-creates a cluster if enough compute is available.
```json
{
  "requiredCompute": 500
}
```
Response: `201 { "job": {...}, "cluster": {...} }`

### DELETE /api/swarm/cluster/:clusterId
Dissolve a cluster. Nodes return to idle pool.
Response: `200 { "message": "Cluster dissolved" }`

---

## Social Links
- X (Twitter): https://x.com/macminiclaws
- Moltbook: https://www.moltbook.com/u/macminiclaw

## Network
- Chain: Base Sepolia (testnet)
- Chain ID: 84532
- RPC: https://sepolia.base.org

To switch to mainnet, change RPC_URL and CHAIN_ID in .env:
- Chain ID: 8453
- RPC: https://mainnet.base.org
