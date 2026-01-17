import requests
import sys
import json
from datetime import datetime

class AquaFreshProAPITester:
    def __init__(self, base_url="https://produto-futuro.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {name}")
        if details:
            print(f"   Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        headers = {'Content-Type': 'application/json'}

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    details = f"Status: {response.status_code}, Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Non-dict response'}"
                except:
                    details = f"Status: {response.status_code}, Response length: {len(response.text)}"
            else:
                details = f"Expected {expected_status}, got {response.status_code}. Response: {response.text[:200]}"

            self.log_test(name, success, details)
            return success, response.json() if success and response.text else {}

        except requests.exceptions.Timeout:
            self.log_test(name, False, f"Request timed out after {timeout} seconds")
            return False, {}
        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_product_info(self):
        """Test product information endpoint"""
        success, response = self.run_test("Product Info", "GET", "product", 200)
        
        if success:
            # Verify required fields are present
            required_fields = ['name', 'slogan', 'description', 'versions', 'pricing', 'target_audiences', 'features']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                self.log_test("Product Info - Required Fields", False, f"Missing fields: {missing_fields}")
                return False
            else:
                self.log_test("Product Info - Required Fields", True, "All required fields present")
                
                # Check versions have pricing in R$ and USD
                versions = response.get('versions', [])
                pricing_check = all('price_brl' in v and 'price_usd' in v for v in versions)
                self.log_test("Product Versions - Pricing", pricing_check, f"Found {len(versions)} versions with pricing")
                
        return success

    def test_product_versions(self):
        """Test product versions endpoint"""
        return self.run_test("Product Versions", "GET", "product/versions", 200)

    def test_buyer_personas(self):
        """Test buyer personas endpoint"""
        return self.run_test("Buyer Personas", "GET", "product/personas", 200)

    def test_marketing_info(self):
        """Test marketing information endpoint"""
        return self.run_test("Marketing Info", "GET", "product/marketing", 200)

    def test_get_images(self):
        """Test get generated images endpoint"""
        return self.run_test("Get Generated Images", "GET", "images", 200)

    def test_image_generation(self):
        """Test image generation endpoint - with long timeout"""
        print(f"\n⚠️  Image generation test - this may take up to 90 seconds...")
        
        test_data = {
            "prompt": "Test image for AquaFresh Pro",
            "style": "product_studio"
        }
        
        success, response = self.run_test(
            "Image Generation", 
            "POST", 
            "generate-image", 
            200, 
            data=test_data, 
            timeout=95  # 95 second timeout
        )
        
        if success:
            # Verify response has required fields
            required_fields = ['success', 'image_base64', 'prompt_used']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                self.log_test("Image Generation - Response Fields", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("Image Generation - Response Fields", True, "All required fields present")
                
                # Check if image_base64 is not empty
                image_data = response.get('image_base64', '')
                if len(image_data) > 100:  # Basic check for base64 data
                    self.log_test("Image Generation - Base64 Data", True, f"Image data length: {len(image_data)}")
                else:
                    self.log_test("Image Generation - Base64 Data", False, "Image data appears empty or too short")
        
        return success

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test creating a status check
        test_data = {"client_name": "test_client"}
        success, response = self.run_test("Create Status Check", "POST", "status", 200, data=test_data)
        
        if success:
            # Test getting status checks
            self.run_test("Get Status Checks", "GET", "status", 200)
        
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting AquaFresh Pro API Tests")
        print("=" * 50)
        
        # Basic API tests
        self.test_api_root()
        self.test_product_info()
        self.test_product_versions()
        self.test_buyer_personas()
        self.test_marketing_info()
        self.test_get_images()
        self.test_status_endpoints()
        
        # Image generation test (potentially slow)
        print(f"\n🎨 Starting Image Generation Test (may take up to 90 seconds)...")
        self.test_image_generation()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary:")
        print(f"   Tests Run: {self.tests_run}")
        print(f"   Tests Passed: {self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed. Check details above.")
            return 1

def main():
    tester = AquaFreshProAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())