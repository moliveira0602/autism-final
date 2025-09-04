#!/usr/bin/env python3
"""
TEIA Footer Impact Test Suite
Quick verification that footer implementations didn't affect backend API functionality.
Testing specific endpoints as requested in the review.
"""

import requests
import json
from datetime import datetime
from typing import Dict, Any

# Configuration - using the same URL as frontend
BASE_URL = "http://localhost:8001/api"
HEADERS = {"Content-Type": "application/json"}

class FooterImpactTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str = "", details: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if not success and details:
            print(f"   Details: {details}")
        print()

    def test_api_health_check(self):
        """Test basic API health check (GET /api/)"""
        try:
            response = requests.get(f"{self.base_url}/")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "TEIA" in data["message"]:
                    self.log_test("API Health Check", True, f"API is running: {data['message']}")
                    return True
                else:
                    self.log_test("API Health Check", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("API Health Check", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}")
            return False

    def test_get_all_establishments(self):
        """Test GET /api/establishments - basic endpoint"""
        try:
            response = requests.get(f"{self.base_url}/establishments")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("GET /api/establishments", True, f"Retrieved {len(data)} establishments")
                    return True, data
                else:
                    self.log_test("GET /api/establishments", False, "Invalid response format - not a list", data)
                    return False, None
            else:
                self.log_test("GET /api/establishments", False, f"HTTP {response.status_code}", response.text)
                return False, None
                
        except Exception as e:
            self.log_test("GET /api/establishments", False, f"Connection error: {str(e)}")
            return False, None

    def test_get_establishment_by_id(self, establishment_id: str):
        """Test GET /api/establishments/{id} - specific establishment"""
        try:
            response = requests.get(f"{self.base_url}/establishments/{establishment_id}")
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "name" in data:
                    self.log_test("GET /api/establishments/{id}", True, f"Retrieved establishment: {data['name']}")
                    return True
                else:
                    self.log_test("GET /api/establishments/{id}", False, "Invalid establishment data", data)
                    return False
            elif response.status_code == 404:
                self.log_test("GET /api/establishments/{id}", True, "Establishment not found (404) - expected behavior")
                return True
            else:
                self.log_test("GET /api/establishments/{id}", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("GET /api/establishments/{id}", False, f"Connection error: {str(e)}")
            return False

    def test_get_all_users(self):
        """Test GET /api/users - basic users endpoint"""
        try:
            response = requests.get(f"{self.base_url}/users")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("GET /api/users", True, f"Retrieved {len(data)} users")
                    return True
                else:
                    self.log_test("GET /api/users", False, "Invalid response format - not a list", data)
                    return False
            else:
                self.log_test("GET /api/users", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("GET /api/users", False, f"Connection error: {str(e)}")
            return False

    def test_filter_establishments_certified_with_limit(self):
        """Test GET /api/establishments?limit=3&certified_only=true - specific filter"""
        try:
            response = requests.get(f"{self.base_url}/establishments?limit=3&certified_only=true")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    # Check that we got at most 3 results
                    if len(data) <= 3:
                        # Check that all returned establishments are certified (if any)
                        all_certified = all(est.get("certified_autism_friendly", False) for est in data) if data else True
                        if all_certified:
                            self.log_test("GET /api/establishments?limit=3&certified_only=true", True, 
                                        f"Retrieved {len(data)} certified establishments (max 3)")
                            return True
                        else:
                            self.log_test("GET /api/establishments?limit=3&certified_only=true", False, 
                                        "Some establishments are not certified")
                            return False
                    else:
                        self.log_test("GET /api/establishments?limit=3&certified_only=true", False, 
                                    f"Returned {len(data)} results, expected max 3")
                        return False
                else:
                    self.log_test("GET /api/establishments?limit=3&certified_only=true", False, 
                                "Invalid response format - not a list", data)
                    return False
            else:
                self.log_test("GET /api/establishments?limit=3&certified_only=true", False, 
                            f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("GET /api/establishments?limit=3&certified_only=true", False, 
                        f"Connection error: {str(e)}")
            return False

    def test_sample_data_integrity(self):
        """Verify that sample data is still being returned correctly"""
        try:
            # Get all establishments to check for sample data
            success, establishments = self.test_get_all_establishments()
            if not success:
                return False
                
            if not establishments:
                self.log_test("Sample Data Integrity", True, "No establishments found - empty database is valid")
                return True
                
            # Check that establishments have required fields
            sample_est = establishments[0]
            required_fields = ["id", "name", "type", "description", "address", "coordinates"]
            missing_fields = [field for field in required_fields if field not in sample_est]
            
            if not missing_fields:
                self.log_test("Sample Data Integrity", True, 
                            f"Sample establishment has all required fields: {sample_est['name']}")
                return True
            else:
                self.log_test("Sample Data Integrity", False, 
                            f"Missing fields in sample data: {missing_fields}")
                return False
                
        except Exception as e:
            self.log_test("Sample Data Integrity", False, f"Error checking sample data: {str(e)}")
            return False

    def run_footer_impact_tests(self):
        """Run focused tests to verify footer changes didn't break backend"""
        print("=" * 80)
        print("TEIA FOOTER IMPACT TEST SUITE")
        print("Verifying that footer implementations didn't affect backend API functionality")
        print("=" * 80)
        print()
        
        tests = [
            self.test_api_health_check,
            self.test_get_all_establishments,
            self.test_get_all_users,
            self.test_filter_establishments_certified_with_limit,
            self.test_sample_data_integrity
        ]
        
        passed = 0
        failed = 0
        
        # Run basic tests first
        for test in tests:
            if test():
                passed += 1
            else:
                failed += 1
        
        # Test specific establishment ID if we have establishments
        success, establishments = self.test_get_all_establishments()
        if success and establishments:
            # Test with first establishment ID
            if self.test_get_establishment_by_id(establishments[0]["id"]):
                passed += 1
            else:
                failed += 1
        else:
            # Test with a dummy ID to verify 404 handling
            if self.test_get_establishment_by_id("dummy-id-123"):
                passed += 1
            else:
                failed += 1
        
        print("=" * 80)
        print("FOOTER IMPACT TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {passed + failed}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print(f"Success Rate: {(passed / (passed + failed) * 100):.1f}%")
        print()
        
        if failed > 0:
            print("FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"- {result['test']}: {result['message']}")
        else:
            print("🎉 ALL TESTS PASSED - Footer implementations did not affect backend functionality!")
        
        return passed, failed

if __name__ == "__main__":
    tester = FooterImpactTester()
    passed, failed = tester.run_footer_impact_tests()
    
    # Exit with error code if any tests failed
    exit(0 if failed == 0 else 1)