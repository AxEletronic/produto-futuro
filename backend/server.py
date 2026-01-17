from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="AquaFresh Pro - Produto Inovador")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== MODELOS ==============

class ProductImage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    prompt: str
    image_base64: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ImageGenerationRequest(BaseModel):
    prompt: str
    style: str = "product_studio"

class ProductInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = "AquaFresh Pro"
    slogan: str = "Hidratação Inteligente para Sua Vida"
    description: str
    problem_solved: str
    target_audiences: List[dict]
    features: List[dict]
    materials: List[str]
    dimensions: dict
    versions: List[dict]
    pricing: dict
    suppliers: List[dict]
    marketing_strategy: dict
    buyer_personas: List[dict]
    sales_channels: List[dict]
    expansion_opportunities: List[str]

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# ============== DADOS DO PRODUTO ==============

PRODUCT_DATA = {
    "name": "AquaFresh Pro",
    "slogan": "Hidratação Inteligente para Sua Vida",
    "tagline": "A garrafa que cuida de você",
    "description": """O AquaFresh Pro é uma garrafa térmica inteligente com sistema de lembretes de hidratação, 
    filtro UV-C integrado para purificação instantânea da água, sensor de temperatura em tempo real 
    e compartimento secreto para suplementos/medicamentos. É o primeiro produto que combina hidratação 
    saudável com tecnologia de purificação e organização pessoal em um único dispositivo compacto.""",
    
    "problem_solved": """Milhões de pessoas sofrem de desidratação crônica sem perceber - causando fadiga, 
    dores de cabeça, problemas de pele e baixa produtividade. Além disso, muitas pessoas precisam carregar 
    suplementos ou medicamentos separadamente, correndo risco de esquecer. O AquaFresh Pro resolve 
    3 problemas em 1: hidratação consciente, água sempre pura e organização de suplementos.""",
    
    "why_innovative": [
        "Primeiro produto a combinar 4 tecnologias em uma garrafa: UV-C, sensores, lembretes e compartimento secreto",
        "Resolve problema silencioso que afeta 75% da população (desidratação crônica)",
        "Atende necessidade crescente por saúde preventiva pós-pandemia",
        "Design minimalista que esconde a tecnologia - parece uma garrafa premium comum",
        "Preço acessível comparado a dispositivos de saúde similares"
    ],
    
    "target_audiences": [
        {
            "name": "Profissionais Ocupados",
            "age": "25-45 anos",
            "description": "Executivos, empreendedores, trabalhadores remotos que esquecem de beber água",
            "pain_points": ["Esquece de se hidratar", "Precisa de praticidade", "Busca produtos premium"]
        },
        {
            "name": "Entusiastas de Fitness",
            "age": "18-40 anos", 
            "description": "Pessoas que frequentam academia, praticam esportes, cuidam da alimentação",
            "pain_points": ["Carrega suplementos separados", "Quer água sempre pura", "Monitora hidratação"]
        },
        {
            "name": "Idosos Ativos",
            "age": "55-75 anos",
            "description": "Pessoas que precisam tomar medicamentos em horários específicos",
            "pain_points": ["Esquece remédios", "Precisa de lembretes", "Quer simplicidade"]
        },
        {
            "name": "Viajantes Frequentes",
            "age": "25-55 anos",
            "description": "Pessoas que viajam a trabalho ou lazer e precisam de água segura",
            "pain_points": ["Água de qualidade duvidosa", "Praticidade", "Multi-funcionalidade"]
        }
    ],
    
    "features": [
        {
            "icon": "💡",
            "name": "Lembretes Inteligentes de Hidratação",
            "description": "LED colorido pisca em intervalos personalizáveis (30min-2h) para lembrar de beber água. Cor muda conforme proximidade do horário."
        },
        {
            "icon": "🔬",
            "name": "Purificação UV-C",
            "description": "Sistema de luz ultravioleta que elimina 99,9% das bactérias e vírus em 60 segundos. Ativação por botão."
        },
        {
            "icon": "🌡️",
            "name": "Sensor de Temperatura",
            "description": "Display LED discreto mostra temperatura da água em tempo real. Mantém gelada por 24h ou quente por 12h."
        },
        {
            "icon": "💊",
            "name": "Compartimento Secreto",
            "description": "Base com rosca para guardar suplementos, vitaminas ou medicamentos. Capacidade para 7 dias de doses."
        },
        {
            "icon": "📱",
            "name": "Conectividade Bluetooth (Premium)",
            "description": "App opcional para tracking de hidratação, histórico e metas personalizadas."
        },
        {
            "icon": "🔋",
            "name": "Bateria de Longa Duração",
            "description": "Recarga USB-C, dura até 30 dias com uso normal. Indicador de bateria no display."
        }
    ],
    
    "materials": [
        "Aço inoxidável 304 alimentício (corpo externo)",
        "Isolamento a vácuo de dupla parede",
        "Plástico Tritan BPA-free (compartimento interno)",
        "LED UV-C de alta eficiência",
        "Silicone médico (vedações)",
        "Componentes eletrônicos impermeáveis IP67"
    ],
    
    "dimensions": {
        "height": "26 cm",
        "diameter": "7.5 cm",
        "capacity": "500ml / 750ml",
        "weight": "380g (vazia)",
        "pill_compartment": "Capacidade para 14 cápsulas médias"
    },
    
    "versions": [
        {
            "name": "AquaFresh Essential",
            "features": ["Térmica", "Compartimento secreto", "Sem eletrônicos"],
            "cost_usd": 8,
            "price_usd": 29.99,
            "cost_brl": 40,
            "price_brl": 149.90,
            "margin_percent": 275
        },
        {
            "name": "AquaFresh Smart",
            "features": ["Térmica", "UV-C", "Lembretes LED", "Compartimento"],
            "cost_usd": 15,
            "price_usd": 59.99,
            "cost_brl": 75,
            "price_brl": 299.90,
            "margin_percent": 300
        },
        {
            "name": "AquaFresh Pro",
            "features": ["Todas", "App Bluetooth", "Display temperatura", "Premium"],
            "cost_usd": 22,
            "price_usd": 89.99,
            "cost_brl": 110,
            "price_brl": 449.90,
            "margin_percent": 309
        },
        {
            "name": "Kit Família (4 unidades)",
            "features": ["4x AquaFresh Smart", "Cores variadas", "Desconto 20%"],
            "cost_usd": 55,
            "price_usd": 189.99,
            "cost_brl": 275,
            "price_brl": 949.90,
            "margin_percent": 245
        }
    ],
    
    "pricing": {
        "supplier_cost_range_usd": "$8 - $22",
        "retail_price_range_usd": "$29.99 - $89.99",
        "supplier_cost_range_brl": "R$ 40 - R$ 110",
        "retail_price_range_brl": "R$ 149,90 - R$ 449,90",
        "average_margin": "275% - 309%",
        "break_even_units": "50 unidades",
        "monthly_profit_100_units_brl": "R$ 22.490",
        "monthly_profit_100_units_usd": "$4.499"
    },
    
    "suppliers": [
        {
            "region": "China - Shenzhen/Yiwu",
            "type": "Fabricação OEM/ODM",
            "platforms": ["Alibaba", "1688.com", "Made-in-China"],
            "moq": "100-500 unidades",
            "lead_time": "15-30 dias"
        },
        {
            "region": "Brasil - São Paulo",
            "type": "Importadores/Distribuidores",
            "platforms": ["Atacadão dos Presentes", "ImportShop", "AliExpress Brasil"],
            "moq": "10-50 unidades",
            "lead_time": "3-7 dias"
        },
        {
            "region": "Componentes Eletrônicos",
            "type": "Módulos UV-C e sensores",
            "platforms": ["LCSC", "Mouser", "Digikey"],
            "moq": "Variável",
            "lead_time": "7-14 dias"
        }
    ],
    
    "marketing_strategy": {
        "positioning": "Produto de saúde premium acessível - não é apenas uma garrafa, é um assistente de bem-estar",
        "key_messages": [
            "75% das pessoas estão desidratadas sem saber",
            "3 problemas resolvidos em 1 produto",
            "Tecnologia hospitalar no seu dia a dia",
            "Design premium, preço justo"
        ],
        "content_ideas": [
            "Vídeos educativos sobre desidratação",
            "Unboxing e reviews com influenciadores fitness",
            "Comparativo: garrafa comum vs AquaFresh Pro",
            "Depoimentos de usuários (antes/depois)"
        ],
        "hashtags": ["#HidrataçãoInteligente", "#AquaFreshPro", "#SaúdeTodosDias", "#BemEstar"]
    },
    
    "buyer_personas": [
        {
            "name": "Marina, 32 anos",
            "occupation": "Gerente de Marketing",
            "income": "R$ 8.000-12.000/mês",
            "behavior": "Compra online, segue influenciadores de lifestyle, valoriza praticidade",
            "motivation": "Quer se hidratar melhor mas sempre esquece, gosta de produtos bonitos",
            "objection": "Será que funciona mesmo? Já tenho garrafa térmica.",
            "trigger": "Ver uma amiga usando e comentando dos lembretes"
        },
        {
            "name": "Carlos, 45 anos",
            "occupation": "Empresário",
            "income": "R$ 15.000+/mês",
            "behavior": "Compra qualidade, viaja frequentemente, toma suplementos",
            "motivation": "Praticidade para viagens, não quer carregar várias coisas",
            "objection": "Preço alto para uma garrafa",
            "trigger": "Descobrir o compartimento secreto para suplementos"
        },
        {
            "name": "Dona Lucia, 62 anos",
            "occupation": "Aposentada",
            "income": "R$ 3.000-5.000/mês",
            "behavior": "Filho/neto ajuda nas compras online, preocupada com saúde",
            "motivation": "Precisa lembrar de tomar remédios e beber água",
            "objection": "Tecnologia muito complicada",
            "trigger": "Presente do filho preocupado com a saúde dela"
        }
    ],
    
    "sales_channels": [
        {"name": "Shopee", "commission": "12-15%", "pros": "Alto tráfego, frete grátis", "strategy": "Preço competitivo, cupons"},
        {"name": "Mercado Livre", "commission": "11-16%", "pros": "Maior marketplace BR", "strategy": "Mercado Envios Full, reputação"},
        {"name": "Amazon Brasil", "commission": "8-15%", "pros": "Público premium", "strategy": "FBA, anúncios patrocinados"},
        {"name": "Instagram Shop", "commission": "5%", "pros": "Venda direta, branding", "strategy": "Conteúdo + influenciadores"},
        {"name": "Loja Própria", "commission": "2-3% (gateway)", "pros": "Margem máxima", "strategy": "Shopify/Nuvemshop, tráfego pago"}
    ],
    
    "expansion_opportunities": [
        "Linha Kids com personagens e app gamificado",
        "Versão corporativa com branding empresarial",
        "Parceria com academias e studios",
        "Assinatura de filtros UV-C de reposição",
        "Acessórios: capas, alças, bases carregadoras",
        "Versão para pets com dosador de água",
        "Integração com apps de saúde (Apple Health, Google Fit)"
    ],
    
    "colors": [
        {"name": "Midnight Black", "hex": "#1a1a2e"},
        {"name": "Arctic White", "hex": "#f8f9fa"},
        {"name": "Ocean Blue", "hex": "#0077b6"},
        {"name": "Rose Gold", "hex": "#b76e79"},
        {"name": "Forest Green", "hex": "#2d6a4f"}
    ],
    
    "alternative_names": [
        "HydroSmart Bottle",
        "PureFlow Pro",
        "VitaBottle Plus",
        "SmartSip 360",
        "AquaGuard Elite"
    ]
}

# ============== ROTAS DA API ==============

@api_router.get("/")
async def root():
    return {"message": "AquaFresh Pro API - Produto Inovador", "version": "1.0.0"}

@api_router.get("/product")
async def get_product_info():
    """Retorna todas as informações do produto"""
    return PRODUCT_DATA

@api_router.get("/product/versions")
async def get_product_versions():
    """Retorna as versões do produto com preços"""
    return {"versions": PRODUCT_DATA["versions"], "pricing": PRODUCT_DATA["pricing"]}

@api_router.get("/product/personas")
async def get_buyer_personas():
    """Retorna as personas compradoras"""
    return {"personas": PRODUCT_DATA["buyer_personas"]}

@api_router.get("/product/marketing")
async def get_marketing_info():
    """Retorna estratégia de marketing"""
    return {
        "strategy": PRODUCT_DATA["marketing_strategy"],
        "channels": PRODUCT_DATA["sales_channels"]
    }

@api_router.post("/generate-image")
async def generate_product_image(request: ImageGenerationRequest):
    """Gera imagem do produto usando OpenAI gpt-image-1"""
    try:
        from emergentintegrations.llm.openai.image_generation import OpenAIImageGeneration
        
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY not configured")
        
        # Construir prompt profissional baseado no estilo
        style_prompts = {
            "product_studio": """Professional product photography of a premium smart water bottle called AquaFresh Pro. 
                The bottle is sleek stainless steel with a matte black finish, featuring a subtle LED ring near the top 
                and a discreet digital temperature display. Studio lighting with soft shadows, clean white background, 
                8K ultra realistic, commercial product shot, minimalist aesthetic.""",
            
            "lifestyle": """Lifestyle product photography of a modern smart water bottle on a minimalist desk setup. 
                Premium stainless steel bottle with matte finish, subtle LED indicators, next to a laptop and plant. 
                Natural soft lighting, shallow depth of field, aspirational lifestyle shot, 8K ultra realistic.""",
            
            "closeup": """Extreme close-up macro shot of a premium smart water bottle's UV-C purification system 
                and LED indicator ring. Showing the sophisticated technology integrated into sleek stainless steel design. 
                Studio lighting, 8K ultra realistic, technical product detail shot.""",
            
            "in_use": """Action shot of a fit professional person drinking from a sleek smart water bottle during workout. 
                Premium stainless steel bottle with LED indicators visible. Gym environment, dynamic lighting, 
                8K ultra realistic, lifestyle advertising photography.""",
            
            "custom": request.prompt
        }
        
        final_prompt = style_prompts.get(request.style, request.prompt)
        if request.style != "custom" and request.prompt:
            final_prompt = f"{final_prompt} Additional details: {request.prompt}"
        
        logger.info(f"Generating image with prompt: {final_prompt[:100]}...")
        
        image_gen = OpenAIImageGeneration(api_key=api_key)
        images = await image_gen.generate_images(
            prompt=final_prompt,
            model="gpt-image-1",
            number_of_images=1
        )
        
        if images and len(images) > 0:
            image_base64 = base64.b64encode(images[0]).decode('utf-8')
            
            # Salvar no banco de dados
            image_doc = {
                "id": str(uuid.uuid4()),
                "prompt": final_prompt,
                "style": request.style,
                "image_base64": image_base64,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.product_images.insert_one(image_doc)
            
            return {
                "success": True,
                "image_base64": image_base64,
                "prompt_used": final_prompt
            }
        else:
            raise HTTPException(status_code=500, detail="No image was generated")
            
    except Exception as e:
        logger.error(f"Error generating image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating image: {str(e)}")

@api_router.get("/images")
async def get_generated_images():
    """Retorna todas as imagens geradas"""
    images = await db.product_images.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return {"images": images}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
