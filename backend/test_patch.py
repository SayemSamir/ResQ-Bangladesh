import requests

# 1. Admin Login to get token
login_url = "http://127.0.0.1:8000/users/login"
login_payload = {
    "email": "admin@resq.com",        # আপনার তৈরি করা এডমিন ইমেইল
    "password": "adminpassword123"    # আপনার পাসওয়ার্ড
}

try:
    login_response = requests.post(login_url, json=login_payload)
    login_data = login_response.json()
    
    if login_response.status_code != 200:
        print("Login Failed:", login_data)
        exit()

    token = login_data.get("access_token")
    print("✅ Login Successful! Token Received.")

    # 2. PATCH Request to Update Emergency Status
    patch_url = "http://127.0.0.1:8000/emergency/3/status"  # emergency_id = 3
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    status_payload = {
        "status": "resolved"
    }

    patch_response = requests.patch(patch_url, json=status_payload, headers=headers)
    
    print("Status Code:", patch_response.status_code)
    print("Response Body:", patch_response.json())

except Exception as e:
    print("Error:", str(e))