import { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ============== COMPONENTES ==============

const Navbar = ({ activeSection, setActiveSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Início' },
    { id: 'problem', label: 'O Problema' },
    { id: 'features', label: 'Recursos' },
    { id: 'versions', label: 'Versões' },
    { id: 'business', label: 'Negócio' },
    { id: 'gallery', label: 'Galeria' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💧</span>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AquaFresh Pro
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                data-testid={`nav-${item.id}`}
                onClick={() => {
                  setActiveSection(item.id);
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-sm font-medium transition-colors ${activeSection === item.id ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = () => (
  <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
    <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")\"}}></div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
          <span className="animate-pulse w-2 h-2 bg-cyan-400 rounded-full"></span>
          <span className="text-cyan-400 text-sm font-medium">Produto Inovador 2025</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-white">AquaFresh</span>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Pro</span>
        </h1>
        
        <p className="text-2xl md:text-3xl text-cyan-400 font-light mb-4">
          💧 Hidratação Inteligente para Sua Vida
        </p>
        
        <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-10">
          A primeira garrafa térmica inteligente com purificação UV-C, lembretes de hidratação
          e compartimento secreto para suplementos. Três problemas resolvidos em um único produto revolucionário.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-4 py-2">
            <span className="text-2xl">🔬</span>
            <span className="text-gray-300">UV-C 99,9%</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-4 py-2">
            <span className="text-2xl">🌡️</span>
            <span className="text-gray-300">Sensor Temp</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-4 py-2">
            <span className="text-2xl">💊</span>
            <span className="text-gray-300">Compartimento</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-4 py-2">
            <span className="text-2xl">💡</span>
            <span className="text-gray-300">Lembretes LED</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            data-testid="cta-versions"
            onClick={() => document.getElementById('versions')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:scale-105"
          >
            Ver Versões e Preços
          </button>
          <button 
            data-testid="cta-gallery"
            onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 border border-cyan-500/30 text-cyan-400 font-semibold rounded-xl hover:bg-cyan-500/10 transition-all"
          >
            Gerar Imagens do Produto
          </button>
        </div>
      </div>
    </div>
    
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </section>
);

const ProblemSection = ({ productData }) => (
  <section id="problem" className="py-20 bg-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          O Problema que <span className="text-red-400">75% das Pessoas</span> Ignoram
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          {productData?.problem_solved}
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-gradient-to-br from-red-500/10 to-red-900/10 border border-red-500/20 rounded-2xl p-6">
          <div className="text-4xl mb-4">😫</div>
          <h3 className="text-xl font-semibold text-white mb-2">Desidratação Crônica</h3>
          <p className="text-gray-400">Fadiga, dores de cabeça e baixa produtividade causados por falta de água adequada.</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-900/10 border border-orange-500/20 rounded-2xl p-6">
          <div className="text-4xl mb-4">🦠</div>
          <h3 className="text-xl font-semibold text-white mb-2">Água Contaminada</h3>
          <p className="text-gray-400">Bactérias e vírus em água de bebedouros, viagens e fontes desconhecidas.</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-900/10 border border-yellow-500/20 rounded-2xl p-6">
          <div className="text-4xl mb-4">💊</div>
          <h3 className="text-xl font-semibold text-white mb-2">Suplementos Esquecidos</h3>
          <p className="text-gray-400">Medicamentos e vitaminas esquecidos ou perdidos durante o dia.</p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Por que é Inovador?</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productData?.why_innovative?.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-cyan-400 text-xl">✓</span>
              <span className="text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = ({ productData }) => (
  <section id="features" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Tecnologia de Ponta em <span className="text-cyan-400">Suas Mãos</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Cada detalhe foi pensado para revolucionar sua experiência de hidratação
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productData?.features?.map((feature, index) => (
          <div 
            key={index} 
            data-testid={`feature-${index}`}
            className="group bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-cyan-500/50 hover:bg-slate-800 transition-all duration-300"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{feature.name}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-16 grid md:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">📐 Dimensões</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Altura: {productData?.dimensions?.height}</li>
            <li>Diâmetro: {productData?.dimensions?.diameter}</li>
            <li>Capacidade: {productData?.dimensions?.capacity}</li>
            <li>Peso: {productData?.dimensions?.weight}</li>
            <li>Compartimento: {productData?.dimensions?.pill_compartment}</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">🔧 Materiais Premium</h3>
          <ul className="space-y-2 text-gray-400">
            {productData?.materials?.map((material, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-cyan-400">•</span>
                {material}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const VersionsSection = ({ productData }) => (
  <section id="versions" className="py-20 bg-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Escolha Sua <span className="text-cyan-400">Versão Ideal</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Opções para todos os perfis e bolsos - do básico ao premium
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productData?.versions?.map((version, index) => (
          <div 
            key={index}
            data-testid={`version-${index}`}
            className={`relative bg-slate-800/50 border rounded-2xl p-6 transition-all hover:scale-105 ${
              index === 2 ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' : 'border-slate-700'
            }`}
          >
            {index === 2 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                MAIS POPULAR
              </div>
            )}
            <h3 className="text-lg font-semibold text-white mb-2">{version.name}</h3>
            <ul className="text-gray-400 text-sm mb-4 space-y-1">
              {version.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span>
                  {feat}
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-700 pt-4">
              <div className="text-gray-500 text-xs mb-1">Custo Fornecedor</div>
              <div className="text-gray-400 line-through text-sm">
                ${version.cost_usd} / R$ {version.cost_brl}
              </div>
              <div className="text-gray-500 text-xs mt-2 mb-1">Preço de Venda</div>
              <div className="text-2xl font-bold text-cyan-400">
                ${version.price_usd}
              </div>
              <div className="text-lg text-white">
                R$ {version.price_brl?.toFixed(2).replace('.', ',')}
              </div>
              <div className="mt-2 inline-block bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                Margem: {version.margin_percent}%
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">💰 Análise de Lucro</h3>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-gray-400 text-sm">Custo Médio</div>
            <div className="text-xl font-bold text-white">{productData?.pricing?.supplier_cost_range_brl}</div>
            <div className="text-gray-500 text-xs">{productData?.pricing?.supplier_cost_range_usd}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Preço de Venda</div>
            <div className="text-xl font-bold text-cyan-400">{productData?.pricing?.retail_price_range_brl}</div>
            <div className="text-gray-500 text-xs">{productData?.pricing?.retail_price_range_usd}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Margem de Lucro</div>
            <div className="text-xl font-bold text-green-400">{productData?.pricing?.average_margin}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Lucro/mês (100 un.)</div>
            <div className="text-xl font-bold text-green-400">{productData?.pricing?.monthly_profit_100_units_brl}</div>
            <div className="text-gray-500 text-xs">{productData?.pricing?.monthly_profit_100_units_usd}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const BusinessSection = ({ productData }) => (
  <section id="business" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Modelo de <span className="text-cyan-400">Negócio Completo</span>
        </h2>
      </div>
      
      {/* Público-Alvo */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-6">🎯 Público-Alvo</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productData?.target_audiences?.map((audience, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <div className="text-lg font-semibold text-white mb-1">{audience.name}</div>
              <div className="text-cyan-400 text-sm mb-2">{audience.age}</div>
              <p className="text-gray-400 text-sm mb-3">{audience.description}</p>
              <div className="space-y-1">
                {audience.pain_points?.map((pain, i) => (
                  <span key={i} className="inline-block bg-red-500/10 text-red-400 text-xs px-2 py-1 rounded mr-1 mb-1">
                    {pain}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Personas */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-6">👤 Personas Compradoras</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {productData?.buyer_personas?.map((persona, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="text-xl font-semibold text-white mb-1">{persona.name}</div>
              <div className="text-cyan-400 text-sm mb-1">{persona.occupation}</div>
              <div className="text-green-400 text-sm mb-3">{persona.income}</div>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Comportamento:</span> <span className="text-gray-300">{persona.behavior}</span></p>
                <p><span className="text-gray-500">Motivação:</span> <span className="text-gray-300">{persona.motivation}</span></p>
                <p><span className="text-gray-500">Objeção:</span> <span className="text-red-400">{persona.objection}</span></p>
                <p><span className="text-gray-500">Gatilho:</span> <span className="text-green-400">{persona.trigger}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Canais de Venda */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-6">🛒 Canais de Venda</h3>
        <div className="grid md:grid-cols-5 gap-4">
          {productData?.sales_channels?.map((channel, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="text-lg font-semibold text-white mb-1">{channel.name}</div>
              <div className="text-cyan-400 text-sm mb-2">Comissão: {channel.commission}</div>
              <p className="text-gray-400 text-xs mb-2">{channel.pros}</p>
              <p className="text-gray-500 text-xs">Estratégia: {channel.strategy}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Fornecedores */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-6">🏭 Fornecedores</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {productData?.suppliers?.map((supplier, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <div className="text-lg font-semibold text-white mb-1">{supplier.region}</div>
              <div className="text-cyan-400 text-sm mb-2">{supplier.type}</div>
              <div className="text-gray-400 text-sm mb-2">
                Plataformas: {supplier.platforms?.join(', ')}
              </div>
              <div className="flex gap-2 text-xs">
                <span className="bg-slate-700 text-gray-300 px-2 py-1 rounded">MOQ: {supplier.moq}</span>
                <span className="bg-slate-700 text-gray-300 px-2 py-1 rounded">{supplier.lead_time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Marketing */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-6">📢 Estratégia de Marketing</h3>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <p className="text-cyan-400 text-lg mb-4">{productData?.marketing_strategy?.positioning}</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-3">Mensagens-Chave</h4>
              <ul className="space-y-2">
                {productData?.marketing_strategy?.key_messages?.map((msg, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                    <span className="text-cyan-400">→</span> {msg}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Ideias de Conteúdo</h4>
              <ul className="space-y-2">
                {productData?.marketing_strategy?.content_ideas?.map((idea, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                    <span className="text-cyan-400">→</span> {idea}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {productData?.marketing_strategy?.hashtags?.map((tag, i) => (
              <span key={i} className="bg-cyan-500/20 text-cyan-400 text-sm px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Expansão */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">🚀 Oportunidades de Expansão</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {productData?.expansion_opportunities?.map((opp, index) => (
            <div key={index} className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4">
              <span className="text-gray-300">{opp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const GallerySection = ({ onGenerateImage, generatedImages, isGenerating }) => {
  const [selectedStyle, setSelectedStyle] = useState('product_studio');
  const [customPrompt, setCustomPrompt] = useState('');

  const styles = [
    { id: 'product_studio', label: '📸 Estúdio', description: 'Foto profissional de produto' },
    { id: 'lifestyle', label: '🏠 Lifestyle', description: 'Ambiente de uso' },
    { id: 'closeup', label: '🔍 Close-up', description: 'Detalhes técnicos' },
    { id: 'in_use', label: '🏃 Em Uso', description: 'Pessoa usando' },
    { id: 'custom', label: '✏️ Personalizado', description: 'Seu prompt' },
  ];

  const handleGenerate = () => {
    onGenerateImage(selectedStyle === 'custom' ? customPrompt : '', selectedStyle);
  };

  return (
    <section id="gallery" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🎨 Gerador de <span className="text-cyan-400">Imagens do Produto</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Gere imagens ultra realistas do AquaFresh Pro usando IA (OpenAI gpt-image-1)
          </p>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Selecione o Estilo da Imagem</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {styles.map((style) => (
              <button
                key={style.id}
                data-testid={`style-${style.id}`}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-3 rounded-xl border transition-all ${
                  selectedStyle === style.id
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-slate-500'
                }`}
              >
                <div className="text-lg">{style.label}</div>
                <div className="text-xs text-gray-500">{style.description}</div>
              </button>
            ))}
          </div>
          
          {selectedStyle === 'custom' && (
            <textarea
              data-testid="custom-prompt-input"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Descreva a imagem que você quer gerar..."
              className="w-full bg-slate-700 border border-slate-600 rounded-xl p-4 text-white placeholder-gray-500 mb-4 resize-none h-24"
            />
          )}
          
          <button
            data-testid="generate-image-btn"
            onClick={handleGenerate}
            disabled={isGenerating || (selectedStyle === 'custom' && !customPrompt)}
            className={`w-full py-4 rounded-xl font-semibold transition-all ${
              isGenerating
                ? 'bg-slate-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Gerando imagem... (pode levar até 60 segundos)
              </span>
            ) : (
              '🖼️ Gerar Imagem do Produto'
            )}
          </button>
        </div>
        
        {/* Imagens Geradas */}
        {generatedImages.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Imagens Geradas</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedImages.map((img, index) => (
                <div key={index} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                  <img
                    src={`data:image/png;base64,${img.image_base64}`}
                    alt={`Produto gerado ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-gray-400 text-xs truncate">{img.prompt_used?.substring(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const Footer = ({ productData }) => (
  <footer className="bg-slate-950 py-12 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl">💧</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AquaFresh Pro
          </span>
        </div>
        <p className="text-cyan-400 text-lg mb-4">{productData?.slogan}</p>
        <div className="flex justify-center gap-4 mb-6">
          {productData?.colors?.map((color, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full border-2 border-white/20 shadow-lg"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
        <p className="text-gray-500 text-sm">
          Nomes alternativos: {productData?.alternative_names?.join(' • ')}
        </p>
        <p className="text-gray-600 text-xs mt-4">
          © 2025 AquaFresh Pro - Produto conceitual para fins de demonstração
        </p>
      </div>
    </div>
  </footer>
);

// ============== APP PRINCIPAL ==============

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [productData, setProductData] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${API}/product`);
        setProductData(response.data);
      } catch (error) {
        console.error('Erro ao carregar dados do produto:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchImages = async () => {
      try {
        const response = await axios.get(`${API}/images`);
        setGeneratedImages(response.data.images || []);
      } catch (error) {
        console.error('Erro ao carregar imagens:', error);
      }
    };

    fetchProductData();
    fetchImages();
  }, []);

  const handleGenerateImage = async (customPrompt, style) => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`${API}/generate-image`, {
        prompt: customPrompt || '',
        style: style
      });
      
      if (response.data.success) {
        setGeneratedImages(prev => [{
          image_base64: response.data.image_base64,
          prompt_used: response.data.prompt_used
        }, ...prev]);
      }
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Intersection Observer para active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-cyan-400">Carregando AquaFresh Pro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-slate-900 text-white">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <HeroSection />
      <ProblemSection productData={productData} />
      <FeaturesSection productData={productData} />
      <VersionsSection productData={productData} />
      <BusinessSection productData={productData} />
      <GallerySection 
        onGenerateImage={handleGenerateImage}
        generatedImages={generatedImages}
        isGenerating={isGenerating}
      />
      <Footer productData={productData} />
    </div>
  );
}

export default App;
