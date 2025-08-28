import os
from openai import AzureOpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get credentials
api_key = os.getenv("AZURE_OPENAI_API_KEY")
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")

print("Configuration:")
print(f"Endpoint: {endpoint}")
print(f"Deployment: {deployment}")
print(f"API Version: {api_version}")
print(f"API Key Present: {bool(api_key)}")

try:
    # Initialize client
    client = AzureOpenAI(
        api_key=api_key,
        api_version=api_version,
        azure_endpoint=endpoint
    )
    
    # Test call
    response = client.chat.completions.create(
        model=deployment,
        messages=[{"role": "user", "content": "Hello"}],
        max_tokens=10
    )
    
    print("\n✅ SUCCESS! Azure OpenAI is working!")
    print(f"Response: {response.choices[0].message.content}")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\nTroubleshooting:")
    print("1. Check your deployment name in Azure Portal")
    print("2. Ensure your API key is correct")
    print("3. Verify the endpoint URL")