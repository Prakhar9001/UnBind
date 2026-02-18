import os
import sys

try:
    import requests  # type: ignore
except ImportError:
    print("[FAIL] 'requests' package is not installed. Run: pip install requests")
    sys.exit(1)
# Attempt to load dotenv, but handle if it's not installed yet in the environment
try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except ImportError:
    print("[WARN] python-dotenv not installed. Relying on system environment variables.")

def verify_google_books():
    api_key = os.getenv("GOOGLE_BOOKS_API_KEY")
    if not api_key or "your_" in api_key:
        print("[FAIL] GOOGLE_BOOKS_API_KEY is missing or default.")
        return False
    
    # Test ISBN: Atomic Habits
    isbn = "9780735211292"
    url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&key={api_key}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data["totalItems"] > 0:
                print(f"[SUCCESS] Google Books API Connected. Found: {data['items'][0]['volumeInfo']['title']}")
                return True
            else:
                print("[WARN] Google Books API responded but found no books. Key might be valid but quota/search issue.")
                return True
        else:
            print(f"[FAIL] Google Books API Error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"[FAIL] Google Books Connection Error: {e}")
        return False

def verify_openai():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or "your_" in api_key:
        print("[FAIL] OPENAI_API_KEY is missing or default.")
        return False
    
    # Simple direct request to list models or complete to verify key
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": "ping"}],
        "max_tokens": 5
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            print("[SUCCESS] OpenAI API Connected.")
            return True
        else:
            print(f"[FAIL] OpenAI API Error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"[FAIL] OpenAI Connection Error: {e}")
        return False

def verify_firebase():
    project_id = os.getenv("FIREBASE_PROJECT_ID")
    if not project_id or "your_" in project_id:
        print("[FAIL] FIREBASE_PROJECT_ID is missing or default.")
        return False
    
    # Without Admin SDK json, we can't easily verify auth, but we can check if we know the project ID.
    # If a service account path is provided, we could verify that.
    print(f"[INFO] Firebase Project ID: {project_id}")
    print("[INFO] Full Firebase verification requires Admin SDK setup (Phase 3). Skipping deep check.")
    return True

if __name__ == "__main__":
    print("--- Verifying Links ---")
    g_status = verify_google_books()
    o_status = verify_openai()
    f_status = verify_firebase()
    
    if g_status and o_status:
        print("\n[SUCCESS] Critical Links Verified.")
    else:
        print("\n[FAIL] Some links failed. Check .env configuration.")
