from fastapi import FastAPI

from routes import twilio_stream 
from routes import respond
#from schemas import websocket
from routes import intentconfirm
from routes import trans
from routes import call_log
from routes import testrest
app =FastAPI()


from fastapi.middleware.cors import CORSMiddleware

#app = FastAPI()

origins = [
    "http://localhost:3000",  # React dev server
    # You can add other URLs if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trans.router, prefix='/twilio', tags=['twilio'])
app.include_router(intentconfirm.app , prefix='/twilio', tags=['twilio'])
app.include_router(respond.router ,prefix='/twilio', tags=['twilio'] )
app.include_router(twilio_stream.router, prefix = '/twilio', tags=['twilio'] )
app.include_router(call_log.app, prefix='/rest', tags=['rest'])
app.include_router(testrest.router, prefix='/testaudio', tags=['rest'])
@app.get('/')
def root ( ):
    return {"message": "Hello, may I know thsedfsfe reason for calling?"}


