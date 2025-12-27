import asyncio
import httpx
import sys

BASE_URL = "http://localhost:8000"

async def test_telegram_webhook():
    print("--- Testing Telegram Webhook ---")
    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Start
        print("1. Sending /start...")
        resp = await client.post(f"{BASE_URL}/api/telegram/webhook", json={
            "message": {
                "chat": {"id": 999999, "type": "private"},
                "text": "/start"
            }
        })
        print(f"   Status: {resp.status_code}")
        if resp.status_code != 200: return False

        # 2. Select Country
        print("2. Selecting 'Canada'...")
        resp = await client.post(f"{BASE_URL}/api/telegram/webhook", json={
            "message": {
                "chat": {"id": 999999, "type": "private"},
                "text": "Canada"
            }
        })
        print(f"   Status: {resp.status_code}")
        
        # 3. Apply
        print("3. Sending 'Apply'...")
        resp = await client.post(f"{BASE_URL}/api/telegram/webhook", json={
            "message": {
                "chat": {"id": 999999, "type": "private"},
                "text": "apply"
            }
        })
        
        # 4. Provide Name
        print("4. Providing Name 'Test User'...")
        resp = await client.post(f"{BASE_URL}/api/telegram/webhook", json={
            "message": {
                "chat": {"id": 999999, "type": "private"},
                "text": "Name: Test User"
            }
        })
        
        return True

async def test_leads_api():
    print("\n--- Testing Leads API ---")
    async with httpx.AsyncClient() as client:
        # 1. Fetch Leads
        print("1. Fetching all leads...")
        resp = await client.get(f"{BASE_URL}/api/leads/")
        print(f"   Status: {resp.status_code}")
        if resp.status_code != 200:
            print(f"   Error: {resp.text}")
            return False
        
        leads = resp.json()
        print(f"   Found {len(leads)} leads.")
        
        if not leads:
            print("   No leads found to test update.")
            return True

        # 2. Update Status
        lead_id = leads[0]["id"]
        print(f"2. Updating Lead {lead_id} status to 'applied'...")
        resp = await client.patch(f"{BASE_URL}/api/leads/{lead_id}", json={"status": "applied"})
        print(f"   Status: {resp.status_code}")
        if resp.status_code != 200:
            print(f"   Error: {resp.text}")
            return False
            
        return True

async def main():
    try:
        # Increased timeout
        timeout = httpx.Timeout(10.0, connect=10.0)
        async with httpx.AsyncClient(timeout=timeout) as client:
             # We pass client to functions
             pass 

        tg_ok = await test_telegram_webhook()
        leads_ok = await test_leads_api()
        
        if tg_ok and leads_ok:
            print("\n✅ ALL SYSTEM TESTS PASSED")
        else:
            print("\n❌ SOME TESTS FAILED")
            sys.exit(1)
            
    except Exception as e:
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
