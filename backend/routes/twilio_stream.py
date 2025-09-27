from fastapi import APIRouter, Request
from fastapi.responses import PlainTextResponse

router = APIRouter()

@router.post("/voice")
async def twilio_voice(request: Request):
    form = await request.form()
    callsid = form.get("CallSid")
    print("Received CallSid:", callsid)


    twiml = f"""
<Response>
    <Say>Welcome to the AI customer service. Please tell us how we can help you.</Say>
    <Start>
    <Stream url="wss://126d143a3672.ngrok-free.app/ws/stream?callsid={callsid}" />

    </Start>
    <Pause length="30" />
    <Say>Ok we got it. Goodbye!</Say>
    <Redirect>/twilio/respond</Redirect>
    <Hangup />
</Response>
    """

    return PlainTextResponse(content=twiml, media_type="application/xml")
