# CoList
## Install :
### Backend
```
git clone https://github.com/Lbutynski/CoList
cd backend
npm i
```
Create a .env file with :
```
MONGO_URI="mongodb://<Your Mongo Address>/CoList"
SERVER_PORT=<Your server port>
SERVER_FRONT_ADDRESS=<Address of the front server for CORS>
```
Then :
```
node server.js
```
### Frontend
```
cd frontend
npm i
```
Create a .env file with : 
```
VITE_BACKEND_SERVER_URI=<Your backend server>
```
Then :
```
npm run dev
```
