from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="TEIA - Algarve Autism Friendly API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Enums
class EstablishmentType(str, Enum):
    HOTEL = "hotel"
    RESTAURANT = "restaurant"
    ATTRACTION = "attraction"
    EVENT = "event"
    SHOPPING = "shopping"
    TRANSPORT = "transport"


class SensoryLevel(str, Enum):
    VERY_LOW = "very_low"
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    VERY_HIGH = "very_high"


class AccessibilityFeature(str, Enum):
    QUIET_SPACES = "quiet_spaces"
    SENSORY_ROOMS = "sensory_rooms"
    LOW_LIGHTING = "low_lighting"
    TRAINED_STAFF = "trained_staff"
    VISUAL_SCHEDULES = "visual_schedules"
    NOISE_REDUCTION = "noise_reduction"
    CALM_ENVIRONMENT = "calm_environment"
    FLEXIBLE_TIMING = "flexible_timing"


# Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatusCheckCreate(BaseModel):
    client_name: str


class SensoryProfile(BaseModel):
    noise_sensitivity: SensoryLevel
    light_sensitivity: SensoryLevel
    crowd_tolerance: SensoryLevel
    communication_needs: str
    specific_triggers: List[str] = []
    preferred_times: List[str] = []


class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    sensory_profile: SensoryProfile
    language_preference: str = "pt"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserProfileCreate(BaseModel):
    name: str
    email: str
    sensory_profile: SensoryProfile
    language_preference: str = "pt"


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    sensory_profile: Optional[SensoryProfile] = None
    language_preference: Optional[str] = None


class EstablishmentReview(BaseModel):
    user_id: str
    rating: int = Field(ge=1, le=5)
    noise_level: SensoryLevel
    lighting_level: SensoryLevel
    visual_clarity: SensoryLevel
    staff_helpfulness: int = Field(ge=1, le=5)
    calm_areas_available: bool
    comment: str = ""
    helpful_votes: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Establishment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: EstablishmentType
    description: str
    address: str
    coordinates: Dict[str, float]  # {"lat": 37.0, "lng": -8.0}
    accessibility_features: List[AccessibilityFeature]
    certified_autism_friendly: bool = False
    certification_date: Optional[datetime] = None
    contact_info: Dict[str, str] = {}  # phone, email, website
    opening_hours: Dict[str, str] = {}  # day_of_week: "09:00-18:00"
    special_hours: List[str] = []  # Special autism-friendly hours
    sensory_info: Dict[str, Any] = {}  # noise levels, lighting, etc.
    reviews: List[EstablishmentReview] = []
    average_rating: float = 0.0
    autism_rating: float = 0.0  # Special rating for autism-friendliness
    images: List[str] = []  # Base64 encoded images
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class EstablishmentCreate(BaseModel):
    name: str
    type: EstablishmentType
    description: str
    address: str
    coordinates: Dict[str, float]
    accessibility_features: List[AccessibilityFeature] = []
    contact_info: Dict[str, str] = {}
    opening_hours: Dict[str, str] = {}
    special_hours: List[str] = []
    sensory_info: Dict[str, Any] = {}
    images: List[str] = []


class EstablishmentUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[EstablishmentType] = None
    description: Optional[str] = None
    address: Optional[str] = None
    coordinates: Optional[Dict[str, float]] = None
    accessibility_features: Optional[List[AccessibilityFeature]] = None
    certified_autism_friendly: Optional[bool] = None
    certification_date: Optional[datetime] = None
    contact_info: Optional[Dict[str, str]] = None
    opening_hours: Optional[Dict[str, str]] = None
    special_hours: Optional[List[str]] = None
    sensory_info: Optional[Dict[str, Any]] = None
    images: Optional[List[str]] = None


class ReviewCreate(BaseModel):
    user_id: str
    rating: int = Field(ge=1, le=5)
    noise_level: SensoryLevel
    lighting_level: SensoryLevel
    visual_clarity: SensoryLevel
    staff_helpfulness: int = Field(ge=1, le=5)
    calm_areas_available: bool
    comment: str = ""


class Partner(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    logo_url: str
    website_url: str = ""
    description: str = ""
    is_active: bool = True
    display_order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class PartnerCreate(BaseModel):
    name: str
    logo_url: str
    website_url: str = ""
    description: str = ""
    is_active: bool = True
    display_order: int = 0


class PartnerUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


# API Routes
@api_router.get("/")
async def root():
    return {"message": "TEIA - Algarve Autism Friendly API", "version": "1.0.0"}


# Status check endpoints (keeping existing ones)
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# User Profile endpoints
@api_router.post("/users", response_model=UserProfile)
async def create_user_profile(user: UserProfileCreate):
    user_dict = user.dict()
    user_obj = UserProfile(**user_dict)
    result = await db.users.insert_one(user_obj.dict())
    return user_obj


@api_router.get("/users/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserProfile(**user)


@api_router.put("/users/{user_id}", response_model=UserProfile)
async def update_user_profile(user_id: str, user_update: UserProfileUpdate):
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await db.users.find_one({"id": user_id})
    return UserProfile(**updated_user)


@api_router.get("/users", response_model=List[UserProfile])
async def get_all_users(skip: int = 0, limit: int = 100):
    users = await db.users.find().skip(skip).limit(limit).to_list(limit)
    return [UserProfile(**user) for user in users]


# Establishment endpoints
@api_router.post("/establishments", response_model=Establishment)
async def create_establishment(establishment: EstablishmentCreate):
    est_dict = establishment.dict()
    est_obj = Establishment(**est_dict)
    result = await db.establishments.insert_one(est_obj.dict())
    return est_obj


@api_router.get("/establishments/{establishment_id}", response_model=Establishment)
async def get_establishment(establishment_id: str):
    establishment = await db.establishments.find_one({"id": establishment_id})
    if not establishment:
        raise HTTPException(status_code=404, detail="Establishment not found")
    return Establishment(**establishment)


@api_router.put("/establishments/{establishment_id}", response_model=Establishment)
async def update_establishment(establishment_id: str, est_update: EstablishmentUpdate):
    update_data = {k: v for k, v in est_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.establishments.update_one(
        {"id": establishment_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Establishment not found")
    
    updated_establishment = await db.establishments.find_one({"id": establishment_id})
    return Establishment(**updated_establishment)


@api_router.delete("/establishments/{establishment_id}")
async def delete_establishment(establishment_id: str):
    result = await db.establishments.delete_one({"id": establishment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Establishment not found")
    return {"message": "Establishment deleted successfully"}


@api_router.get("/establishments", response_model=List[Establishment])
async def get_establishments(
    skip: int = 0,
    limit: int = 100,
    type: Optional[EstablishmentType] = None,
    certified_only: bool = False,
    features: Optional[List[AccessibilityFeature]] = Query(None),
    min_rating: Optional[float] = None
):
    # Build filter query
    filter_query = {}
    
    if type:
        filter_query["type"] = type
    
    if certified_only:
        filter_query["certified_autism_friendly"] = True
    
    if features:
        filter_query["accessibility_features"] = {"$in": features}
    
    if min_rating is not None:
        filter_query["autism_rating"] = {"$gte": min_rating}
    
    establishments = await db.establishments.find(filter_query).skip(skip).limit(limit).to_list(limit)
    return [Establishment(**est) for est in establishments]


# Review endpoints
@api_router.post("/establishments/{establishment_id}/reviews")
async def add_review(establishment_id: str, review: ReviewCreate):
    # Check if establishment exists
    establishment = await db.establishments.find_one({"id": establishment_id})
    if not establishment:
        raise HTTPException(status_code=404, detail="Establishment not found")
    
    review_dict = review.dict()
    review_obj = EstablishmentReview(**review_dict)
    
    # Add review to establishment
    await db.establishments.update_one(
        {"id": establishment_id},
        {
            "$push": {"reviews": review_obj.dict()},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    
    # Recalculate ratings
    updated_establishment = await db.establishments.find_one({"id": establishment_id})
    reviews = updated_establishment.get("reviews", [])
    
    if reviews:
        avg_rating = sum(r["rating"] for r in reviews) / len(reviews)
        
        # Map sensory levels to numeric values for calculation
        sensory_level_map = {
            "very_low": 1,
            "low": 2,
            "moderate": 3,
            "high": 4,
            "very_high": 5
        }
        
        autism_rating = sum(
            (r["staff_helpfulness"] + (6 - sensory_level_map.get(r["noise_level"], 3)) + 
             (r["calm_areas_available"] and 5 or 1)) / 3 
            for r in reviews
        ) / len(reviews)
        
        await db.establishments.update_one(
            {"id": establishment_id},
            {
                "$set": {
                    "average_rating": round(avg_rating, 2),
                    "autism_rating": round(autism_rating, 2)
                }
            }
        )
    
    return {"message": "Review added successfully"}


@api_router.get("/establishments/{establishment_id}/reviews")
async def get_establishment_reviews(establishment_id: str):
    establishment = await db.establishments.find_one({"id": establishment_id})
    if not establishment:
        raise HTTPException(status_code=404, detail="Establishment not found")
    
    return establishment.get("reviews", [])


# Partners endpoints
@api_router.get("/partners", response_model=List[Partner])
async def get_partners():
    """Get all partners ordered by display_order"""
    partners = await db.partners.find({"is_active": True}).sort("display_order", 1).to_list(1000)
    return [Partner(**partner) for partner in partners]


@api_router.get("/partners/{partner_id}", response_model=Partner)
async def get_partner(partner_id: str):
    """Get a specific partner"""
    partner = await db.partners.find_one({"id": partner_id})
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    return Partner(**partner)


@api_router.post("/partners", response_model=Partner)
async def create_partner(partner: PartnerCreate):
    """Create a new partner"""
    partner_dict = partner.dict()
    partner_obj = Partner(**partner_dict)
    await db.partners.insert_one(partner_obj.dict())
    return partner_obj


@api_router.put("/partners/{partner_id}", response_model=Partner)
async def update_partner(partner_id: str, partner_update: PartnerUpdate):
    """Update a partner"""
    update_data = {k: v for k, v in partner_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.partners.update_one(
        {"id": partner_id}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    updated_partner = await db.partners.find_one({"id": partner_id})
    return Partner(**updated_partner)


@api_router.delete("/partners/{partner_id}")
async def delete_partner(partner_id: str):
    """Delete a partner"""
    result = await db.partners.delete_one({"id": partner_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
    return {"message": "Partner deleted successfully"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db_client():
    """Initialize database with sample data"""
    # Add sample partners if none exist
    existing_partners = await db.partners.count_documents({})
    if existing_partners == 0:
        sample_partners = [
            {
                "id": str(uuid.uuid4()),
                "name": "Câmara Municipal do Algarve",
                "logo_url": "https://via.placeholder.com/200x80/1E40AF/FFFFFF?text=CM+Algarve",
                "website_url": "https://www.cm-algarve.pt",
                "description": "Apoio institucional local",
                "is_active": True,
                "display_order": 1,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Turismo de Portugal",
                "logo_url": "https://via.placeholder.com/200x80/DC2626/FFFFFF?text=Turismo+PT",
                "website_url": "https://www.turismodeportugal.pt",
                "description": "Entidade oficial de turismo",
                "is_active": True,
                "display_order": 2,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Federação Portuguesa de Autismo",
                "logo_url": "https://via.placeholder.com/200x80/059669/FFFFFF?text=FPA",
                "website_url": "https://www.fpda.pt",
                "description": "Organização de apoio às famílias",
                "is_active": True,
                "display_order": 3,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "IPSS Algarve Inclusivo",
                "logo_url": "https://via.placeholder.com/200x80/7C2D12/FFFFFF?text=IPSS+Algarve",
                "website_url": "https://www.algarve-inclusivo.pt",
                "description": "Instituição de apoio social",
                "is_active": True,
                "display_order": 4,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Associação TEIA",
                "logo_url": "https://via.placeholder.com/200x80/7C3AED/FFFFFF?text=TEIA+Assoc",
                "website_url": "https://www.teia-algarve.pt",
                "description": "Associação promotora do projeto",
                "is_active": True,
                "display_order": 5,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        await db.partners.insert_many(sample_partners)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()