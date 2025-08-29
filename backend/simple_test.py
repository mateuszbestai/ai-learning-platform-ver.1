# minimal_test.py
from openai import AzureOpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2024-02-15-preview",  # or your version
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

# Test 1: Basic
print("Test 1: Basic call")
try:
    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
        messages=[{"role": "user", "content": "Hi"}],
        max_tokens=10
    )
    print("✅ Basic call works")
except Exception as e:
    print(f"❌ Basic call failed: {e}")

# Test 2: With JSON format (might fail)
print("\nTest 2: JSON format")
try:
    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
        messages=[{"role": "user", "content": "Return JSON"}],
        response_format={"type": "json_object"}
    )
    print("✅ JSON format works")
except Exception as e:
    print(f"❌ JSON format failed: {e}")
    print("   Remove response_format from your code!")