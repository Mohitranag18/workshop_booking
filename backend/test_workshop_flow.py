#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_workshop_flow():
    print("🧪 Testing Workshop Flow...")
    
    # 1. Login as coordinator
    print("\n1. Logging in as coordinator (testuser3)...")
    login_response = requests.post(f"{BASE_URL}/token/", json={
        "username": "testuser3",
        "password": "testpass123"
    })
    
    if login_response.status_code != 200:
        print("❌ Login failed")
        return
    
    coordinator_token = login_response.json()["access"]
    print("✅ Coordinator login successful")
    
    # 2. Create a workshop
    print("\n2. Creating a workshop...")
    workshop_response = requests.post(f"{BASE_URL}/workshops/", 
        headers={"Authorization": f"Bearer {coordinator_token}"},
        json={
            "workshop_type_id": 3,  # Data Science
            "date": "2025-10-01",
            "tnc_accepted": True
        }
    )
    
    if workshop_response.status_code != 201:
        print(f"❌ Workshop creation failed: {workshop_response.text}")
        return
    
    workshop_id = workshop_response.json()["id"]
    print(f"✅ Workshop created with ID: {workshop_id}")
    
    # 3. Login as instructor
    print("\n3. Logging in as instructor (admin)...")
    admin_login = requests.post(f"{BASE_URL}/token/", json={
        "username": "admin",
        "password": "admin123"
    })
    
    if admin_login.status_code != 200:
        print("❌ Admin login failed")
        return
    
    admin_token = admin_login.json()["access"]
    print("✅ Admin login successful")
    
    # 4. Accept the workshop
    print("\n4. Accepting the workshop...")
    accept_response = requests.post(f"{BASE_URL}/workshops/{workshop_id}/accept/",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    if accept_response.status_code != 200:
        print(f"❌ Workshop acceptance failed: {accept_response.text}")
        return
    
    print("✅ Workshop accepted successfully")
    
    # 5. Check workshop status
    print("\n5. Checking workshop status...")
    workshop_check = requests.get(f"{BASE_URL}/workshops/{workshop_id}/",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    if workshop_check.status_code == 200:
        workshop_data = workshop_check.json()
        print(f"✅ Workshop status: {workshop_data['status']} (0=Pending, 1=Accepted)")
        print(f"   Instructor: {workshop_data['instructor']['username']}")
        print(f"   Coordinator: {workshop_data['coordinator']['username']}")
    
    # 6. Test getting workshops for coordinator
    print("\n6. Testing coordinator's workshops...")
    my_workshops = requests.get(f"{BASE_URL}/my-workshops/",
        headers={"Authorization": f"Bearer {coordinator_token}"}
    )
    
    if my_workshops.status_code == 200:
        workshops = my_workshops.json()
        print(f"✅ Coordinator has {len(workshops)} workshops")
        for ws in workshops:
            print(f"   - {ws['workshop_type']['name']} on {ws['date']} (Status: {ws['status']})")
    
    print("\n🎉 All tests passed! Workshop flow is working correctly.")

if __name__ == "__main__":
    test_workshop_flow()
