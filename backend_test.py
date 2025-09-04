#!/usr/bin/env python3
"""
TEIA Backend API Test Suite
Tests all main endpoints for the Portugal tourism app focused on autism-friendly establishments.
"""

import requests
import json
import uuid
from datetime import datetime
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost:8001/api"
HEADERS = {"Content-Type": "application/json"}

class TEIABackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS
        self.test_results = []
        self.created_user_id = None
        self.created_establishment_id = None
        
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

    def test_create_user_profile(self):
        """Test user profile creation (POST /api/users)"""
        try:
            user_data = {
                "name": "Maria Silva",
                "email": "maria.silva@email.pt",
                "sensory_profile": {
                    "noise_sensitivity": "high",
                    "light_sensitivity": "moderate",
                    "crowd_tolerance": "low",
                    "communication_needs": "Visual aids and clear instructions preferred",
                    "specific_triggers": ["loud music", "flashing lights", "crowded spaces"],
                    "preferred_times": ["morning", "early afternoon"]
                },
                "language_preference": "pt"
            }
            
            response = requests.post(f"{self.base_url}/users", json=user_data, headers=self.headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "name" in data:
                    self.created_user_id = data["id"]
                    self.log_test("Create User Profile", True, f"User created with ID: {data['id']}")
                    return True
                else:
                    self.log_test("Create User Profile", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Create User Profile", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Create User Profile", False, f"Error: {str(e)}")
            return False

    def test_get_user_profile(self):
        """Test get user profile (GET /api/users/{id})"""
        if not self.created_user_id:
            self.log_test("Get User Profile", False, "No user ID available from previous test")
            return False
            
        try:
            response = requests.get(f"{self.base_url}/users/{self.created_user_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data["id"] == self.created_user_id and "sensory_profile" in data:
                    self.log_test("Get User Profile", True, f"Retrieved user: {data['name']}")
                    return True
                else:
                    self.log_test("Get User Profile", False, "Invalid user data", data)
                    return False
            else:
                self.log_test("Get User Profile", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Get User Profile", False, f"Error: {str(e)}")
            return False

    def test_update_user_profile(self):
        """Test update user profile (PUT /api/users/{id})"""
        if not self.created_user_id:
            self.log_test("Update User Profile", False, "No user ID available from previous test")
            return False
            
        try:
            update_data = {
                "language_preference": "en",
                "sensory_profile": {
                    "noise_sensitivity": "very_high",
                    "light_sensitivity": "high",
                    "crowd_tolerance": "very_low",
                    "communication_needs": "Written instructions and quiet environment required",
                    "specific_triggers": ["loud music", "flashing lights", "crowded spaces", "sudden noises"],
                    "preferred_times": ["early morning"]
                }
            }
            
            response = requests.put(f"{self.base_url}/users/{self.created_user_id}", 
                                  json=update_data, headers=self.headers)
            
            if response.status_code == 200:
                data = response.json()
                if data["language_preference"] == "en":
                    self.log_test("Update User Profile", True, "User profile updated successfully")
                    return True
                else:
                    self.log_test("Update User Profile", False, "Update not reflected", data)
                    return False
            else:
                self.log_test("Update User Profile", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Update User Profile", False, f"Error: {str(e)}")
            return False

    def test_create_establishment(self):
        """Test establishment creation (POST /api/establishments)"""
        try:
            establishment_data = {
                "name": "Hotel Quinta do Lago Autism Friendly",
                "type": "hotel",
                "description": "Luxury hotel in Algarve with specialized autism-friendly accommodations and trained staff",
                "address": "Quinta do Lago, 8135-024 Almancil, Algarve, Portugal",
                "coordinates": {"lat": 37.0469, "lng": -8.0147},
                "accessibility_features": ["quiet_spaces", "sensory_rooms", "trained_staff", "calm_environment"],
                "contact_info": {
                    "phone": "+351 289 350 350",
                    "email": "info@quintadolago.com",
                    "website": "https://www.quintadolago.com"
                },
                "opening_hours": {
                    "monday": "24h",
                    "tuesday": "24h",
                    "wednesday": "24h",
                    "thursday": "24h",
                    "friday": "24h",
                    "saturday": "24h",
                    "sunday": "24h"
                },
                "special_hours": ["Quiet hours: 20:00-08:00", "Sensory room available 24/7"],
                "sensory_info": {
                    "noise_level": "low",
                    "lighting": "adjustable",
                    "crowd_density": "controlled",
                    "sensory_breaks": "available"
                }
            }
            
            response = requests.post(f"{self.base_url}/establishments", 
                                   json=establishment_data, headers=self.headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "name" in data:
                    self.created_establishment_id = data["id"]
                    self.log_test("Create Establishment", True, f"Hotel created with ID: {data['id']}")
                    return True
                else:
                    self.log_test("Create Establishment", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Create Establishment", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Create Establishment", False, f"Error: {str(e)}")
            return False

    def test_create_restaurant_establishment(self):
        """Test creating a restaurant establishment"""
        try:
            restaurant_data = {
                "name": "Restaurante O Pescador Sensorial",
                "type": "restaurant",
                "description": "Traditional Portuguese seafood restaurant with autism-friendly dining options in Tavira",
                "address": "Rua José Pires Padinha, 8800-354 Tavira, Algarve, Portugal",
                "coordinates": {"lat": 37.1267, "lng": -7.6486},
                "accessibility_features": ["quiet_spaces", "low_lighting", "trained_staff", "flexible_timing"],
                "contact_info": {
                    "phone": "+351 281 322 145",
                    "email": "reservas@opescador.pt"
                },
                "opening_hours": {
                    "monday": "12:00-15:00, 19:00-23:00",
                    "tuesday": "12:00-15:00, 19:00-23:00",
                    "wednesday": "Closed",
                    "thursday": "12:00-15:00, 19:00-23:00",
                    "friday": "12:00-15:00, 19:00-23:00",
                    "saturday": "12:00-15:00, 19:00-23:00",
                    "sunday": "12:00-15:00, 19:00-23:00"
                },
                "special_hours": ["Quiet dining: 12:00-14:00 daily", "Sensory-friendly menu available"],
                "sensory_info": {
                    "noise_level": "moderate",
                    "lighting": "warm_dim",
                    "music": "soft_traditional",
                    "seating": "quiet_corner_available"
                }
            }
            
            response = requests.post(f"{self.base_url}/establishments", 
                                   json=restaurant_data, headers=self.headers)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Create Restaurant", True, f"Restaurant created: {data['name']}")
                return True
            else:
                self.log_test("Create Restaurant", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Create Restaurant", False, f"Error: {str(e)}")
            return False

    def test_create_attraction_establishment(self):
        """Test creating an attraction establishment"""
        try:
            attraction_data = {
                "name": "Zoomarine Algarve - Sensory Experience",
                "type": "attraction",
                "description": "Marine theme park with special autism-friendly programs and sensory accommodations",
                "address": "EN125 - KM 65, Guia, 8201-864 Albufeira, Algarve, Portugal",
                "coordinates": {"lat": 37.1344, "lng": -8.3056},
                "accessibility_features": ["sensory_rooms", "quiet_spaces", "visual_schedules", "trained_staff", "noise_reduction"],
                "contact_info": {
                    "phone": "+351 289 560 300",
                    "email": "info@zoomarine.pt",
                    "website": "https://www.zoomarine.pt"
                },
                "opening_hours": {
                    "monday": "10:00-18:00",
                    "tuesday": "10:00-18:00",
                    "wednesday": "10:00-18:00",
                    "thursday": "10:00-18:00",
                    "friday": "10:00-18:00",
                    "saturday": "10:00-19:00",
                    "sunday": "10:00-19:00"
                },
                "special_hours": ["Sensory-friendly hours: 10:00-11:00 (reduced capacity)", "Quiet zones available all day"],
                "sensory_info": {
                    "noise_level": "variable_with_quiet_zones",
                    "crowd_management": "timed_entry_available",
                    "sensory_breaks": "multiple_locations",
                    "staff_training": "autism_awareness_certified"
                }
            }
            
            response = requests.post(f"{self.base_url}/establishments", 
                                   json=attraction_data, headers=self.headers)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Create Attraction", True, f"Attraction created: {data['name']}")
                return True
            else:
                self.log_test("Create Attraction", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Create Attraction", False, f"Error: {str(e)}")
            return False

    def test_get_establishment(self):
        """Test get establishment (GET /api/establishments/{id})"""
        if not self.created_establishment_id:
            self.log_test("Get Establishment", False, "No establishment ID available from previous test")
            return False
            
        try:
            response = requests.get(f"{self.base_url}/establishments/{self.created_establishment_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data["id"] == self.created_establishment_id and "accessibility_features" in data:
                    self.log_test("Get Establishment", True, f"Retrieved establishment: {data['name']}")
                    return True
                else:
                    self.log_test("Get Establishment", False, "Invalid establishment data", data)
                    return False
            else:
                self.log_test("Get Establishment", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Get Establishment", False, f"Error: {str(e)}")
            return False

    def test_update_establishment(self):
        """Test update establishment (PUT /api/establishments/{id})"""
        if not self.created_establishment_id:
            self.log_test("Update Establishment", False, "No establishment ID available from previous test")
            return False
            
        try:
            update_data = {
                "certified_autism_friendly": True,
                "certification_date": datetime.utcnow().isoformat(),
                "accessibility_features": ["quiet_spaces", "sensory_rooms", "trained_staff", "calm_environment", "visual_schedules"]
            }
            
            response = requests.put(f"{self.base_url}/establishments/{self.created_establishment_id}", 
                                  json=update_data, headers=self.headers)
            
            if response.status_code == 200:
                data = response.json()
                if data["certified_autism_friendly"] == True:
                    self.log_test("Update Establishment", True, "Establishment certified as autism-friendly")
                    return True
                else:
                    self.log_test("Update Establishment", False, "Update not reflected", data)
                    return False
            else:
                self.log_test("Update Establishment", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Update Establishment", False, f"Error: {str(e)}")
            return False

    def test_get_all_establishments(self):
        """Test get all establishments (GET /api/establishments)"""
        try:
            response = requests.get(f"{self.base_url}/establishments")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    self.log_test("Get All Establishments", True, f"Retrieved {len(data)} establishments")
                    return True
                else:
                    self.log_test("Get All Establishments", True, "No establishments found (empty list)")
                    return True
            else:
                self.log_test("Get All Establishments", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Get All Establishments", False, f"Error: {str(e)}")
            return False

    def test_filter_establishments_by_type(self):
        """Test filtering establishments by type"""
        try:
            response = requests.get(f"{self.base_url}/establishments?type=hotel")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    hotels = [est for est in data if est.get("type") == "hotel"]
                    if len(hotels) == len(data):
                        self.log_test("Filter by Type (Hotel)", True, f"Found {len(hotels)} hotels")
                        return True
                    else:
                        self.log_test("Filter by Type (Hotel)", False, "Filter not working correctly")
                        return False
                else:
                    self.log_test("Filter by Type (Hotel)", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Filter by Type (Hotel)", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Filter by Type (Hotel)", False, f"Error: {str(e)}")
            return False

    def test_filter_establishments_by_certification(self):
        """Test filtering establishments by certification status"""
        try:
            response = requests.get(f"{self.base_url}/establishments?certified_only=true")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    certified = [est for est in data if est.get("certified_autism_friendly") == True]
                    if len(certified) == len(data):
                        self.log_test("Filter by Certification", True, f"Found {len(certified)} certified establishments")
                        return True
                    else:
                        self.log_test("Filter by Certification", False, "Certification filter not working correctly")
                        return False
                else:
                    self.log_test("Filter by Certification", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Filter by Certification", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Filter by Certification", False, f"Error: {str(e)}")
            return False

    def test_filter_establishments_by_features(self):
        """Test filtering establishments by accessibility features"""
        try:
            response = requests.get(f"{self.base_url}/establishments?features=quiet_spaces&features=trained_staff")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Filter by Features", True, f"Found {len(data)} establishments with specified features")
                    return True
                else:
                    self.log_test("Filter by Features", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Filter by Features", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Filter by Features", False, f"Error: {str(e)}")
            return False

    def test_add_review(self):
        """Test adding a review to an establishment (POST /api/establishments/{id}/reviews)"""
        if not self.created_establishment_id or not self.created_user_id:
            self.log_test("Add Review", False, "Missing establishment or user ID from previous tests")
            return False
            
        try:
            review_data = {
                "user_id": self.created_user_id,
                "rating": 5,
                "noise_level": "low",
                "lighting_level": "moderate",
                "visual_clarity": "high",
                "staff_helpfulness": 5,
                "calm_areas_available": True,
                "comment": "Excellent autism-friendly hotel! The staff was very understanding and the sensory room was perfect for my child. Highly recommend for families with autism."
            }
            
            response = requests.post(f"{self.base_url}/establishments/{self.created_establishment_id}/reviews", 
                                   json=review_data, headers=self.headers)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "successfully" in data["message"]:
                    self.log_test("Add Review", True, "Review added successfully")
                    return True
                else:
                    self.log_test("Add Review", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("Add Review", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Add Review", False, f"Error: {str(e)}")
            return False

    def test_get_establishment_reviews(self):
        """Test getting reviews for an establishment (GET /api/establishments/{id}/reviews)"""
        if not self.created_establishment_id:
            self.log_test("Get Reviews", False, "No establishment ID available from previous test")
            return False
            
        try:
            response = requests.get(f"{self.base_url}/establishments/{self.created_establishment_id}/reviews")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    review = data[0]
                    if "rating" in review and "comment" in review:
                        self.log_test("Get Reviews", True, f"Retrieved {len(data)} reviews")
                        return True
                    else:
                        self.log_test("Get Reviews", False, "Invalid review format", review)
                        return False
                else:
                    self.log_test("Get Reviews", True, "No reviews found (empty list)")
                    return True
            else:
                self.log_test("Get Reviews", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Get Reviews", False, f"Error: {str(e)}")
            return False

    def test_delete_establishment(self):
        """Test delete establishment (DELETE /api/establishments/{id})"""
        if not self.created_establishment_id:
            self.log_test("Delete Establishment", False, "No establishment ID available from previous test")
            return False
            
        try:
            response = requests.delete(f"{self.base_url}/establishments/{self.created_establishment_id}")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "deleted" in data["message"]:
                    self.log_test("Delete Establishment", True, "Establishment deleted successfully")
                    return True
                else:
                    self.log_test("Delete Establishment", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("Delete Establishment", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Delete Establishment", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("=" * 80)
        print("TEIA BACKEND API TEST SUITE")
        print("Testing Portugal Tourism App - Autism-Friendly Establishments")
        print("=" * 80)
        print()
        
        tests = [
            self.test_api_health_check,
            self.test_create_user_profile,
            self.test_get_user_profile,
            self.test_update_user_profile,
            self.test_create_establishment,
            self.test_create_restaurant_establishment,
            self.test_create_attraction_establishment,
            self.test_get_establishment,
            self.test_update_establishment,
            self.test_get_all_establishments,
            self.test_filter_establishments_by_type,
            self.test_filter_establishments_by_certification,
            self.test_filter_establishments_by_features,
            self.test_add_review,
            self.test_get_establishment_reviews,
            self.test_delete_establishment
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            if test():
                passed += 1
            else:
                failed += 1
        
        print("=" * 80)
        print("TEST SUMMARY")
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
        
        return passed, failed

if __name__ == "__main__":
    tester = TEIABackendTester()
    passed, failed = tester.run_all_tests()
    
    # Exit with error code if any tests failed
    exit(0 if failed == 0 else 1)