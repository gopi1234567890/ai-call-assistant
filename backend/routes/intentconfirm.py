from fastapi import APIRouter, Request, Response
from twilio.twiml.voice_response import VoiceResponse, Dial
import os 
from pathlib import Path
import json
app = APIRouter()

file = 'transcriptions.json'
@app.post('/get')
async def get_intent( request: Request):
    form = await request.form()

    callid = form.get('Call_Id')
    d= find(callid)
    return {"intent": d["intent"], "transcription": d["transcription"]}

def find(callid:str):
    Path(file).touch(exist_ok=True)
    try:
        with open(file, "r") as f:
            data = json.load(f)
        return data.get(callid, {"transcription": "", "intent": "unknown"})
    except json.JSONDecodeError:
        return {"transcription": "", "intent": "unknown"}



@app.post('/confirm_intent')
async def confirm_intent( request: Request ):
    form = await request.form()
    user_input= form.get('Digits')
    response= VoiceResponse()


    if user_input== '1':
        response.say("thank you ! i am connecting you to the department now ")
        response.dial('+16267252220')
    elif user_input== '2':
        response.say(" i am sorry , but i will connect yoy with one of my representatives to help you out")
        response.dial('+17703980339')
    else:
        response.say(" sorry i did not undersatand the input")
    
    return Response(content=str(response), media_type='application/xml')