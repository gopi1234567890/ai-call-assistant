from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, Response
from twilio.twiml.voice_response import VoiceResponse


studio_router = APIRouter()

@studio_router.post('/studio')
async def studio_flow(request: Request):
    form= await request.form()

    call_sid= form.get('CallSid')
    from_num= form.get("From")
    current_widget= form.get("CurrentWidgit")
    user_input= form.get('SpeechResult') or form.get('Digits')
    recording_url = form.get('RecordingUrl')


    print('call id ', call_sid)
    
    if (current_widget=='gather_1' and user_input):
        result= f'got your input : {user_input}'
    elif current_widget == "callrecording" and recording_url:
        result= f' recording recived {recording_url}'
    else:
        result= 'helloe from backend '

    return JSONResponse(content={'result':result})
