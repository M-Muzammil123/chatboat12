from fastapi import APIRouter, Request, HTTPException, Query, Response
from app.services.whatsapp import verify_webhook, send_whatsapp_message
from app.services.ai_service import get_visa_counselor_response
from app.services.crm import create_new_lead, get_student_profile, update_student_profile

router = APIRouter()

@router.get("/webhook")
async def verify_webhook_token(
    hub_mode: str = Query(alias="hub.mode"),
    hub_verify_token: str = Query(alias="hub.verify_token"),
    hub_challenge: str = Query(alias="hub.challenge")
):
    # Meta Webhook Verification
    if verify_webhook(hub_mode, hub_verify_token):
        return int(hub_challenge)
    raise HTTPException(status_code=403, detail="Verification failed")

@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    data = await request.json()
    
    # Check if it's a message
    try:
        entry = data["entry"][0]
        changes = entry["changes"][0]
        value = changes["value"]
        
        if "messages" in value:
            message = value["messages"][0]
            from_number = message["from"] # WhatsApp ID
            msg_body = message["text"]["body"].strip().lower()
            
            # --- Auto-Reply Flow ---
            
            # --- Auto-Reply Flow ---
            
            # Fetch Context
            student_profile = await get_student_profile(from_number)
            
            # 1. Welcome / Menu
            if msg_body in ["hi", "hello", "start", "hlo"]:
                welcome_msg = (
                    f"Welcome to *Dashboard Visa Business*! 🎓✈️\n"
                    f"Hi {student_profile['name'] or 'Future Scholar'}, we are here to help you study abroad.\n\n"
                    "Select your dream destination:\n"
                    "1. Canada 🇨🇦\n"
                    "2. UK 🇬🇧\n"
                    "3. USA 🇺🇸\n"
                    "4. Australia 🇦🇺\n\n"
                    "Type *Status* to check your application.\n"
                    "Type *Apply* to start your process."
                )
                await send_whatsapp_message(from_number, welcome_msg)
                return {"status": "replied_menu"}

            # 2. Status Check
            if msg_body == "status":
                status_msg = (
                    f"📂 *Application Status*\n"
                    f"Name: {student_profile['name'] or 'Not Provided'}\n"
                    f"Country: {student_profile['country'] or 'Not Selected'}\n"
                    f"Current Status: *{student_profile['status']}*\n\n"
                    "Need to update documents? Just send them here (stub)."
                )
                await send_whatsapp_message(from_number, status_msg)
                return {"status": "replied_status"}

            # 3. Apply Flow (Simple Name Collection)
            if msg_body == "apply":
                if not student_profile['country']:
                    await send_whatsapp_message(from_number, "Please select a country first (e.g., type 'Canada').")
                    return {"status": "replied_error"}
                
                await send_whatsapp_message(from_number, "Great! To start your application, please reply with your *Full Name* like this:\n\nName: John Doe")
                return {"status": "replied_apply_start"}

            if msg_body.startswith("name:"):
                name_received = msg_body.split("name:")[1].strip().title()
                await update_student_profile(from_number, {"name": name_received})
                await send_whatsapp_message(from_number, f"Thanks {name_received}! Your profile is updated. An agent will review your file shortly.")
                return {"status": "replied_name_saved"}

            # 4. Country Selection & Documents
            country_map = {
                "1": "Canada", "canada": "Canada",
                "2": "UK", "uk": "UK",
                "3": "USA", "usa": "USA",
                "4": "Australia", "australia": "Australia"
            }

            selected_country = country_map.get(msg_body)

            if selected_country:
                # Save Lead in CRM
                await create_new_lead(from_number, selected_country)

                # Send Documents List
                docs = {
                    "Canada": "🇨🇦 *Canada Study Visa Req:*\n- Passport\n- IELTS (6.0+)\n- Offer Letter\n- GIC ($10k)\n- Gap Explanation (if any)",
                    "UK": "🇬🇧 *UK Study Visa Req:*\n- Passport\n- CAS Letter\n- IELTS/PTE\n- Bank Statement (28 days old)\n- Medical (TB)",
                    "USA": "🇺🇸 *USA Study Visa Req:*\n- Passport\n- I-20 Form\n- DS-160 Confirmation\n- SEVIS Fee Receipt\n- Proof of Funds",
                    "Australia": "🇦🇺 *Australia Study Visa Req:*\n- Passport\n- CoE (Confirmation of Enrolment)\n- OSHC (Health Cover)\n- GTE Statement\n- English Score"
                }

                response_msg = (
                    f"Great choice! Here are the documents required for {selected_country}:\n\n"
                    f"{docs[selected_country]}\n\n"
                    "Type *Apply* to proceed."
                )
                await send_whatsapp_message(from_number, response_msg)
                return {"status": "replied_docs"}
            
            # 5. AI: Get Response (Context Aware)
            ai_response = await get_visa_counselor_response(
                message["text"]["body"], 
                context=student_profile # Pass the profile data
            ) 
            
            await send_whatsapp_message(from_number, ai_response)
            
    except Exception as e:
        # Just print error, don't fail the webhook response to Meta
        print(f"Error processing webhook: {e}")
        
    return {"status": "received"}
