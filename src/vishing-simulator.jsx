import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Shield, XCircle, CheckCircle, Award, TrendingUp } from 'lucide-react';

const VishingSimulator = () => {
  // ==================== ESTADOS ====================
  const [stage, setStage] = useState('login');
  const [score, setScore] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [scenarioType, setScenarioType] = useState('');
  const [redFlagsEncountered, setRedFlagsEncountered] = useState([]);
  
  // Estados de usuario
  const [userName, setUserName] = useState('');
  const [userResults, setUserResults] = useState({
    bank: null,
    tech: null,
    tax: null,
    family: null,
    package: null,
    ceo: null
  });
  const [inputName, setInputName] = useState('');
  
  // Estados de admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [allUsersData, setAllUsersData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('total');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Credenciales admin
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'bexen2024'
  };

  // ==================== COLORES BEXEN ====================
  const bexenColors = {
    primary: '#1e3a5f',
    secondary: '#2c5282',
    accent: '#3182ce',
    success: '#059669',
    danger: '#dc2626',
    warning: '#f59e0b',
    light: '#f8fafc',
    white: '#ffffff'
  };

  // ==================== FUNCIONES DE STORAGE ====================
  const loadUserData = async (name) => {
    try {
      const normalizedName = name.toLowerCase().trim().replace(/\s+/g, '-');
      const resultsKey = `bexen-results:${normalizedName}`;
      const resultsData = localStorage.getItem(resultsKey);
      
      if (resultsData) {
        const parsedResults = JSON.parse(resultsData);
        setUserResults(parsedResults);
        console.log('✅ Datos cargados para', name);
      } else {
        const emptyResults = {
          bank: null,
          tech: null,
          tax: null,
          family: null,
          package: null,
          ceo: null
        };
        setUserResults(emptyResults);
        console.log('✅ Usuario nuevo:', name);
      }
      
      const userListData = localStorage.getItem('bexen-admin:users-list');
      let userList = userListData ? JSON.parse(userListData) : [];
      
      if (!userList.includes(normalizedName)) {
        userList.push(normalizedName);
        localStorage.setItem('bexen-admin:users-list', JSON.stringify(userList));
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      setUserResults({
        bank: null,
        tech: null,
        tax: null,
        family: null,
        package: null,
        ceo: null
      });
      return false;
    }
  };

  const saveUserResult = async (name, scenario, finalScore) => {
    try {
      const normalizedName = name.toLowerCase().trim().replace(/\s+/g, '-');
      const resultsKey = `bexen-results:${normalizedName}`;
      
      console.log('💾 Guardando resultado:', { name, scenario, finalScore });
      
      const existingData = localStorage.getItem(resultsKey);
      let results = existingData ? JSON.parse(existingData) : {
        bank: null,
        tech: null,
        tax: null,
        family: null,
        package: null,
        ceo: null
      };
      
      results[scenario] = {
        completado: true,
        score: finalScore,
        fecha: new Date().toISOString()
      };
      
      localStorage.setItem(resultsKey, JSON.stringify(results));
      setUserResults(results);
      console.log('✅ Guardado exitoso');
      
      return true;
    } catch (error) {
      console.error('❌ Error guardando:', error);
      return false;
    }
  };

  const handleLogin = async () => {
    if (inputName.trim().length < 2) {
      alert('Por favor ingresa un nombre válido (mínimo 2 caracteres)');
      return;
    }
    
    setUserName(inputName.trim());
    await loadUserData(inputName.trim());
    setStage('scenario_select');
  };

  const handleAdminLogin = () => {
    if (adminUsername === ADMIN_CREDENTIALS.username && adminPassword === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      setAdminLoginError('');
      loadAllUsersData();
      setStage('admin_panel');
    } else {
      setAdminLoginError('Usuario o contraseña incorrectos');
      setAdminPassword('');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminUsername('');
    setAdminPassword('');
    setStage('login');
  };

  const isScenarioCompleted = (scenario) => {
    return userResults[scenario]?.completado || false;
  };

  const getScenarioScore = (scenario) => {
    return userResults[scenario]?.score || null;
  };

  const getScenarioDate = (scenario) => {
    return userResults[scenario]?.fecha || null;
  };

  // ==================== FUNCIONES DE ADMIN ====================
  const loadAllUsersData = () => {
    try {
      const userListData = localStorage.getItem('bexen-admin:users-list');
      const userList = userListData ? JSON.parse(userListData) : [];
      
      const usersData = userList.map(normalizedName => {
        const resultsKey = `bexen-results:${normalizedName}`;
        const resultsData = localStorage.getItem(resultsKey);
        const results = resultsData ? JSON.parse(resultsData) : {};
        
        return {
          name: normalizedName,
          displayName: normalizedName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          results: results
        };
      });
      
      setAllUsersData(usersData);
      return usersData;
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
      return [];
    }
  };

  const calculateUserTotal = (results) => {
    let total = 0;
    let count = 0;
    const scenarios = ['bank', 'tech', 'tax', 'family', 'package', 'ceo'];
    
    scenarios.forEach(scenario => {
      if (results[scenario]?.completado) {
        total += results[scenario].score;
        count++;
      }
    });
    
    return { total, count, average: count > 0 ? Math.round(total / count) : 0 };
  };

  const calculateGlobalStats = (usersData) => {
    const totalUsers = usersData.length;
    let totalScenarios = 0;
    let totalScore = 0;
    let totalPassed = 0;
    
    usersData.forEach(user => {
      const scenarios = ['bank', 'tech', 'tax', 'family', 'package', 'ceo'];
      scenarios.forEach(scenario => {
        if (user.results[scenario]?.completado) {
          totalScenarios++;
          const score = user.results[scenario].score;
          totalScore += score;
          if (score >= 60) totalPassed++;
        }
      });
    });
    
    return {
      totalUsers,
      totalScenarios,
      averageScore: totalScenarios > 0 ? Math.round(totalScore / totalScenarios) : 0,
      passRate: totalScenarios > 0 ? Math.round((totalPassed / totalScenarios) * 100) : 0
    };
  };

  const getLeaderboard = (usersData, limit = 10) => {
    return usersData
      .map(user => ({
        ...user,
        stats: calculateUserTotal(user.results)
      }))
      .filter(user => user.stats.count > 0)
      .sort((a, b) => b.stats.average - a.stats.average)
      .slice(0, limit);
  };

  const exportToCSV = () => {
    const usersData = allUsersData.length > 0 ? allUsersData : loadAllUsersData();
    
    let csv = 'Nombre,Banco,Tech,CEO,Tax,Familia,Paquetería,Total,Promedio,Completados\n';
    
    usersData.forEach(user => {
      const stats = calculateUserTotal(user.results);
      const row = [
        user.displayName,
        user.results.bank?.score || '-',
        user.results.tech?.score || '-',
        user.results.ceo?.score || '-',
        user.results.tax?.score || '-',
        user.results.family?.score || '-',
        user.results.package?.score || '-',
        stats.total,
        stats.average,
        `${stats.count}/6`
      ].join(',');
      csv += row + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bexen-resultados-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAllData = () => {
    if (window.confirm('⚠️ ¿Borrar TODOS los datos? Esta acción NO se puede deshacer.')) {
      if (window.confirm('🚨 Última confirmación. Escribe OK en la siguiente ventana.')) {
        const confirmation = window.prompt('Escribe OK en mayúsculas:');
        if (confirmation === 'OK') {
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.startsWith('bexen-')) {
              localStorage.removeItem(key);
            }
          });
          setAllUsersData([]);
          alert('✅ Todos los datos borrados');
        }
      }
    }
  };

  // ==================== LÓGICA DE ESCENARIOS ====================
  const trackRedFlag = (flag) => {
    if (!redFlagsEncountered.includes(flag)) {
      setRedFlagsEncountered([...redFlagsEncountered, flag]);
    }
  };

  const handleChoice = async (option) => {
    let newScore = score + option.points;
    
    if (option.forceMinScore && newScore < option.forceMinScore) {
      newScore = option.forceMinScore;
    }
    if (option.forceMaxScore && newScore > option.forceMaxScore) {
      newScore = option.forceMaxScore;
    }
    
    setScore(newScore);
    
    if (option.scenario) {
      setScenarioType(option.scenario);
    }
    
    if (option.trackFlag) {
      trackRedFlag(option.trackFlag);
    }
    
    setDecisions([...decisions, {
      stage: stage,
      choice: option.text,
      points: option.points,
      redFlag: option.trackFlag || null
    }]);
    
    setCurrentFeedback(option.feedback);
    setShowFeedback(true);
    
    setTimeout(async () => {
      setShowFeedback(false);
      if (option.next === 'results') {
        if (scenarioType && userName) {
          await saveUserResult(userName, scenarioType, newScore);
        }
        setStage('results');
      } else {
        setStage(option.next);
      }
    }, 2500);
  };

  const restartSimulation = async () => {
    setScore(0);
    setDecisions([]);
    setShowFeedback(false);
    setScenarioType('');
    setRedFlagsEncountered([]);
    
    if (userName) {
      await loadUserData(userName);
    }
    
    setStage('scenario_select');
  };

  // ==================== ESCENARIOS ====================
  const scenarios = {
    // Escenario 1: Banco
    bank_intro: {
      title: "🏦 Llamada del Banco",
      description: "Recibes una llamada inesperada...",
      question: "Tu teléfono suena. ¿Qué haces?",
      options: [
        {
          text: "Contestar la llamada",
          points: 0,
          feedback: "Has contestado. Un hombre se identifica como del departamento de seguridad de tu banco.",
          next: "bank_caller"
        },
        {
          text: "No contestar y buscar el número oficial del banco",
          points: 30,
          feedback: "¡Excelente! Siempre verifica llamadas inesperadas contactando tú al banco.",
          next: "results",
          forceMinScore: 65
        }
      ]
    },
    bank_caller: {
      title: "🏦 Identificación del Llamante",
      description: "El llamante dice: 'Hola, soy Juan del departamento de seguridad. Hemos detectado actividad sospechosa en su cuenta.'",
      question: "¿Cómo respondes?",
      options: [
        {
          text: "Preguntar detalles específicos de mi cuenta",
          points: -20,
          feedback: "Los estafadores pueden tener datos parciales. Nunca compartas información por teléfono.",
          trackFlag: "Dio información al teléfono",
          next: "bank_pressure"
        },
        {
          text: "Decir que llamaré yo al banco directamente",
          points: 30,
          feedback: "¡Correcto! Cuelga y llama tú al número oficial del banco.",
          next: "results",
          forceMinScore: 65
        },
        {
          text: "Dar mi CVV para verificar",
          points: -30,
          feedback: "¡NUNCA des tu CVV por teléfono! Los bancos NUNCA lo piden.",
          trackFlag: "Dio CVV",
          next: "results",
          forceMaxScore: 35
        }
      ]
    },
    bank_pressure: {
      title: "🏦 Presión y Urgencia",
      description: "El llamante insiste: 'Es urgente, pueden estar sacando dinero ahora mismo. Necesito que verifique su CVV inmediatamente.'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Dar el CVV por la urgencia",
          points: -30,
          feedback: "Has caído en la trampa. La urgencia es una táctica común de estafadores.",
          trackFlag: "Cedió a presión",
          next: "results",
          forceMaxScore: 35
        },
        {
          text: "Colgar y llamar al banco",
          points: 30,
          feedback: "¡Perfecto! La urgencia es una red flag. Siempre verifica.",
          next: "results",
          forceMinScore: 65
        }
      ]
    },

    // Escenario 2: Soporte Técnico
    tech_intro: {
      title: "💻 Soporte Técnico",
      description: "Recibes una llamada de 'Microsoft' diciendo que tu ordenador tiene un virus.",
      question: "¿Qué haces?",
      options: [
        {
          text: "Escuchar qué tienen que decir",
          points: 0,
          feedback: "El llamante dice que detectaron un virus grave y necesitan acceso remoto.",
          next: "tech_access"
        },
        {
          text: "Colgar inmediatamente",
          points: 30,
          feedback: "¡Correcto! Microsoft NUNCA llama por problemas técnicos.",
          next: "results",
          forceMinScore: 65
        }
      ]
    },
    tech_access: {
      title: "💻 Solicitud de Acceso",
      description: "Piden que descargues un programa para 'solucionar' el problema remotamente.",
      question: "¿Qué haces?",
      options: [
        {
          text: "Descargar el programa",
          points: -30,
          feedback: "Acabas de darles control total de tu ordenador. Pueden robar toda tu información.",
          trackFlag: "Dio acceso remoto",
          next: "results",
          forceMaxScore: 35
        },
        {
          text: "Rechazar y verificar con un técnico de confianza",
          points: 30,
          feedback: "¡Excelente! Nunca des acceso remoto a llamadas no solicitadas.",
          next: "results",
          forceMinScore: 65
        }
      ]
    },

    // Escenario 3: Agencia Tributaria
    tax_intro: {
      title: "📋 Agencia Tributaria",
      description: "Recibes una llamada urgente de 'Hacienda' sobre una deuda fiscal.",
      question: "¿Qué haces?",
      options: [
        {
          text: "Atender la llamada",
          points: 0,
          feedback: "Dicen que debes 2.500€ y amenazan con acciones legales inmediatas.",
          next: "tax_threat"
        },
        {
          text: "Ignorar y verificar en la web oficial",
          points: 30,
          feedback: "¡Perfecto! Hacienda se comunica por correo oficial, no por teléfono.",
          next: "results",
          forceMinScore: 65
        }
      ]
    },
    tax_threat: {
      title: "📋 Amenazas Legales",
      description: "Amenazan con embargo si no pagas inmediatamente por teléfono.",
      question: "¿Cómo respondes?",
      options: [
        {
          text: "Pagar para evitar problemas",
          points: -30,
          feedback: "Acabas de pagar a estafadores. Hacienda NUNCA pide pagos inmediatos por teléfono.",
          trackFlag: "Pagó por miedo",
          next: "results",
          forceMaxScore: 35
        },
        {
          text: "Colgar y consultar con un asesor fiscal",
          points: 30,
          feedback: "¡Correcto! Las amenazas son una red flag clara.",
          next: "results",
          forceMinScore: 65
        }
      ]
    },

    // Escenario 4: Familiar en apuros
    family_intro: {
      title: "👨‍👩‍👦 Familiar en Apuros",
      description: "Recibes un WhatsApp: 'Mamá/Papá, se me rompió el móvil. Este es mi nuevo número. Necesito dinero urgente.'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Preguntar qué pasó",
          points: 0,
          feedback: "Dice que tuvo un accidente y necesita 500€ para el hospital.",
          next: "family_money"
        },
        {
          text: "Llamar al número antiguo para verificar",
          points: 30,
          feedback: "¡Excelente! Siempre verifica con una llamada al número conocido.",
          next: "results",
          forceMinScore: 65
        }
      ]
    },
    family_money: {
      title: "👨‍👩‍👦 Solicitud de Dinero",
      description: "Insiste que es urgente y pide que transfieras a una cuenta 'del hospital'.",
      question: "¿Qué haces?",
      options: [
        {
          text: "Transferir el dinero",
          points: -30,
          feedback: "Acabas de enviar dinero a estafadores. Siempre verifica identidad en solicitudes de dinero.",
          trackFlag: "Envió dinero sin verificar",
          next: "results",
          forceMaxScore: 35
        },
        {
          text: "Verificar llamando al número antiguo",
          points: 30,
          feedback: "¡Correcto! La urgencia + dinero = red flag.",
          next: "results",
          forceMinScore: 65
        }
      ]
    },

    // Escenario 5: Empresa de paquetería
    package_intro: {
      title: "📦 Empresa de Paquetería",
      description: "SMS: 'Tu paquete está retenido. Paga 2.99€ aquí: [enlace]'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Hacer click en el enlace",
          points: -30,
          feedback: "Es un sitio falso de phishing. Acaban de robar tus datos bancarios.",
          trackFlag: "Click en enlace phishing",
          next: "results",
          forceMaxScore: 35
        },
        {
          text: "Verificar en la app oficial de la empresa",
          points: 30,
          feedback: "¡Perfecto! Nunca hagas click en enlaces de SMS no solicitados.",
          next: "results",
          forceMinScore: 65
        }
      ]
    },

    // Escenario 6: CEO Fraud (Avanzado)
    ceo_intro: {
      title: "💼 CEO/Director - Escenario Avanzado",
      description: "Email urgente de tu CEO pidiendo una transferencia confidencial.",
      question: "¿Qué haces?",
      options: [
        {
          text: "Leer el email completo",
          points: 5,
          feedback: "El email parece legítimo pero tiene prisa inusual.",
          next: "ceo_urgency"
        },
        {
          text: "Verificar por teléfono con el CEO",
          points: 20,
          feedback: "Buena precaución inicial.",
          next: "results",
          scenario: "ceo"
        }
      ]
    },
    ceo_urgency: {
      title: "💼 Solicitud Urgente",
      description: "Pide 50.000€ para cerrar un trato confidencial antes de las 18:00h.",
      question: "¿Qué haces?",
      options: [
        {
          text: "Hacer la transferencia (es el CEO)",
          points: -30,
          feedback: "Has caído en CEO Fraud. Nunca hagas transferencias solo por email.",
          trackFlag: "Transfirió sin verificar CEO",
          next: "results",
          scenario: "ceo"
        },
        {
          text: "Llamar al CEO para confirmar",
          points: 20,
          feedback: "Buena decisión, pero el atacante tiene más tácticas...",
          next: "ceo_pressure"
        }
      ]
    },
    ceo_pressure: {
      title: "💼 Presión Adicional",
      description: "Recibes otro email: 'Estoy en reunión, no puedo hablar. Es CRÍTICO, confío en ti.'",
      question: "Última decisión:",
      options: [
        {
          text: "Confiar y transferir",
          points: -20,
          feedback: "La presión emocional te hizo ceder. Siempre verifica por otro canal.",
          trackFlag: "Cedió a presión CEO",
          next: "results",
          scenario: "ceo"
        },
        {
          text: "Insistir en verificación presencial o por videollamada",
          points: 30,
          feedback: "¡Excelente! Mantuviste el protocolo de seguridad.",
          next: "results",
          scenario: "ceo"
        }
      ]
    }
  };

  const getFinalMessage = (finalScore) => {
    if (finalScore >= 80) return "¡Excelente! Eres muy difícil de engañar.";
    if (finalScore >= 60) return "Bien hecho. Detectaste las señales principales.";
    if (finalScore >= 40) return "Precaución necesaria. Repasa las red flags.";
    return "Alto riesgo. Es importante mejorar tu detección de fraudes.";
  };

  // ==================== CONFETTI EFFECT ====================
  useEffect(() => {
    if (stage === 'results' && score >= 60 && typeof window.confetti !== 'undefined') {
      const duration = 5000;
      const end = Date.now() + duration;

      const frame = () => {
        window.confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#1e3a5f', '#2c5282', '#3182ce']
        });
        window.confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#1e3a5f', '#2c5282', '#3182ce']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [stage, score]);

  // ==================== RENDER: LOGIN ====================
  if (stage === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 50%, #e0f2fe 100%)' }}>
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full border-t-8" style={{ borderTopColor: '#1e3a5f' }}>
          <div className="text-center mb-8">
            <Shield className="w-20 h-20 mx-auto mb-4" style={{ color: '#1e3a5f' }} />
            <h1 className="text-4xl font-black mb-2" style={{ color: '#1e3a5f' }}>BEXEN</h1>
            <p className="text-xl font-semibold text-gray-600">Formación en Ciberseguridad</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Simulador de Vishing
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Ingresa tu nombre para comenzar
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nombre completo:
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Ej: Juan Pérez"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                autoFocus
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 text-xl"
              style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)' }}
            >
              Comenzar Formación
            </button>

            <button
              onClick={() => setStage('admin_login')}
              className="w-full text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg"
              style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
            >
              🔐 Acceso Admin
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border-l-4" style={{ borderLeftColor: '#1e3a5f' }}>
            <p className="text-sm text-gray-700">
              <strong>📊 Sistema de tracking:</strong> Cada escenario solo puede realizarse una vez.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER: ADMIN LOGIN ====================
  if (stage === 'admin_login') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 50%, #e0f2fe 100%)' }}>
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full border-t-8" style={{ borderTopColor: '#059669' }}>
          <div className="text-center mb-8">
            <Award className="w-20 h-20 mx-auto mb-4" style={{ color: '#059669' }} />
            <h1 className="text-4xl font-black mb-2" style={{ color: '#059669' }}>Panel Admin</h1>
            <p className="text-xl font-semibold text-gray-600">BEXEN - Acceso Restringido</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Login de Administrador
            </h2>
          </div>

          {adminLoginError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 font-semibold">❌ {adminLoginError}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Usuario:</label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña:</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
              />
            </div>

            <button
              onClick={handleAdminLogin}
              className="w-full text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 text-xl"
              style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
            >
              🔐 Acceder al Panel
            </button>

            <button
              onClick={() => setStage('login')}
              className="w-full text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all border-2 border-gray-300 hover:border-gray-400"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER: ADMIN PANEL ====================
  if (stage === 'admin_panel') {
    if (!isAdmin) {
      setStage('admin_login');
      return null;
    }

    const stats = calculateGlobalStats(allUsersData);
    const leaderboard = getLeaderboard(allUsersData, 10);
    
    let filteredUsers = allUsersData.filter(user => 
      user.displayName.toLowerCase().includes(filterText.toLowerCase())
    );
    
    filteredUsers.sort((a, b) => {
      const statsA = calculateUserTotal(a.results);
      const statsB = calculateUserTotal(b.results);
      
      let comparison = 0;
      if (sortBy === 'name') comparison = a.displayName.localeCompare(b.displayName);
      else if (sortBy === 'total') comparison = statsA.total - statsB.total;
      else if (sortBy === 'average') comparison = statsA.average - statsB.average;
      else if (sortBy === 'count') comparison = statsA.count - statsB.count;
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return (
      <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 50%, #e0f2fe 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-8" style={{ borderTopColor: '#1e3a5f' }}>
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-black mb-2" style={{ color: '#1e3a5f' }}>
                  📊 Panel de Administración BEXEN
                </h1>
                <p className="text-gray-600 text-lg">Resultados de Formación</p>
              </div>
              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all text-white font-bold hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' }}
              >
                🔓 Cerrar Sesión
              </button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="text-4xl font-black mb-2">{stats.totalUsers}</div>
                <div className="text-sm opacity-90">Participantes</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="text-4xl font-black mb-2">{stats.totalScenarios}</div>
                <div className="text-sm opacity-90">Escenarios Completados</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="text-4xl font-black mb-2">{stats.averageScore}</div>
                <div className="text-sm opacity-90">Puntuación Media</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <div className="text-4xl font-black mb-2">{stats.passRate}%</div>
                <div className="text-sm opacity-90">Tasa Aprobación</div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8 border-2 border-yellow-200">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-2" style={{ color: '#1e3a5f' }}>
                🏆 Top 10
              </h2>
              <div className="space-y-2">
                {leaderboard.map((user, index) => (
                  <div 
                    key={user.name}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-yellow-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl font-black ${index < 3 ? 'text-yellow-500' : 'text-gray-400'}`}>
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{user.displayName}</div>
                        <div className="text-sm text-gray-500">{user.stats.count}/6 escenarios</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black" style={{ color: '#1e3a5f' }}>
                        {user.stats.average}
                      </div>
                      <div className="text-sm text-gray-500">promedio</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controles */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                />
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
                >
                  <option value="total">Por Total</option>
                  <option value="average">Por Promedio</option>
                  <option value="count">Por Completados</option>
                  <option value="name">Por Nombre</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="px-4 py-2 border-2 border-gray-300 rounded-xl hover:border-blue-500 transition-all font-semibold"
                >
                  {sortOrder === 'desc' ? '↓ Mayor' : '↑ Menor'}
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl transition-all text-white font-bold hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
                >
                  📥 CSV
                </button>
                <button
                  onClick={resetAllData}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl transition-all text-white font-bold hover:shadow-lg bg-gradient-to-r from-red-500 to-red-600"
                >
                  🗑️ Reset
                </button>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-white" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)' }}>
                    <th className="p-4 text-left font-bold rounded-tl-xl">Nombre</th>
                    <th className="p-4 text-center font-bold">🏦</th>
                    <th className="p-4 text-center font-bold">💻</th>
                    <th className="p-4 text-center font-bold">💼</th>
                    <th className="p-4 text-center font-bold">📋</th>
                    <th className="p-4 text-center font-bold">👨‍👩‍👦</th>
                    <th className="p-4 text-center font-bold">📦</th>
                    <th className="p-4 text-center font-bold">Total</th>
                    <th className="p-4 text-center font-bold">Prom</th>
                    <th className="p-4 text-center font-bold rounded-tr-xl">Compl</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="p-8 text-center text-gray-500">
                        No hay datos
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => {
                      const stats = calculateUserTotal(user.results);
                      return (
                        <tr 
                          key={user.name}
                          className={`border-b border-gray-200 hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                          <td className="p-4 font-semibold text-gray-800">{user.displayName}</td>
                          <td className="p-4 text-center">
                            {user.results.bank?.completado ? (
                              <span className={`font-bold ${user.results.bank.score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                                {user.results.bank.score}
                              </span>
                            ) : <span className="text-gray-400">-</span>}
                          </td>
                          <td className="p-4 text-center">
                            {user.results.tech?.completado ? (
                              <span className={`font-bold ${user.results.tech.score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                                {user.results.tech.score}
                              </span>
                            ) : <span className="text-gray-400">-</span>}
                          </td>
                          <td className="p-4 text-center">
                            {user.results.ceo?.completado ? (
                              <span className={`font-bold ${user.results.ceo.score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                                {user.results.ceo.score}
                              </span>
                            ) : <span className="text-gray-400">-</span>}
                          </td>
                          <td className="p-4 text-center">
                            {user.results.tax?.completado ? (
                              <span className={`font-bold ${user.results.tax.score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                                {user.results.tax.score}
                              </span>
                            ) : <span className="text-gray-400">-</span>}
                          </td>
                          <td className="p-4 text-center">
                            {user.results.family?.completado ? (
                              <span className={`font-bold ${user.results.family.score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                                {user.results.family.score}
                              </span>
                            ) : <span className="text-gray-400">-</span>}
                          </td>
                          <td className="p-4 text-center">
                            {user.results.package?.completado ? (
                              <span className={`font-bold ${user.results.package.score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                                {user.results.package.score}
                              </span>
                            ) : <span className="text-gray-400">-</span>}
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-black text-lg" style={{ color: '#1e3a5f' }}>
                              {stats.total}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`font-bold ${stats.average >= 60 ? 'text-green-600' : 'text-orange-600'}`}>
                              {stats.average}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-semibold text-gray-700">
                              {stats.count}/6
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-700">
                <strong>📊 Mostrando:</strong> {filteredUsers.length} de {allUsersData.length} participantes
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER: SELECTOR ====================
  if (stage === 'scenario_select') {
    const scenariosData = [
      { key: 'bank', icon: '🏦', title: 'Banco', intro: 'bank_intro' },
      { key: 'tech', icon: '💻', title: 'Soporte Técnico', intro: 'tech_intro' },
      { key: 'tax', icon: '📋', title: 'Agencia Tributaria', intro: 'tax_intro' },
      { key: 'family', icon: '👨‍👩‍👦', title: 'Familiar', intro: 'family_intro' },
      { key: 'package', icon: '📦', title: 'Paquetería', intro: 'package_intro' },
      { key: 'ceo', icon: '💼', title: 'CEO (Avanzado)', intro: 'ceo_intro' }
    ];

    const completedCount = scenariosData.filter(s => isScenarioCompleted(s.key)).length;

    return (
      <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 50%, #e0f2fe 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-8" style={{ borderTopColor: '#1e3a5f' }}>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-black" style={{ color: '#1e3a5f' }}>
                    👤 {userName}
                  </h1>
                  <p className="text-gray-600 text-lg">Formación BEXEN</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black" style={{ color: '#1e3a5f' }}>
                    {completedCount}/6
                  </div>
                  <p className="text-sm text-gray-600">Escenarios</p>
                </div>
              </div>

              <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 rounded-full"
                  style={{ 
                    width: `${(completedCount / 6) * 100}%`,
                    background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)'
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#1e3a5f' }}>
                Selecciona un escenario:
              </h2>

              {scenariosData.map((scenario) => {
                const completed = isScenarioCompleted(scenario.key);
                const scoreValue = getScenarioScore(scenario.key);
                const dateValue = getScenarioDate(scenario.key);

                return (
                  <div
                    key={scenario.key}
                    className={`p-6 rounded-2xl border-3 transition-all ${
                      completed 
                        ? 'bg-gray-50 border-gray-300 opacity-75' 
                        : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg cursor-pointer transform hover:scale-[1.02]'
                    }`}
                    style={{ borderWidth: '3px' }}
                    onClick={() => {
                      if (!completed) {
                        setScore(0);
                        setDecisions([]);
                        setRedFlagsEncountered([]);
                        setScenarioType(scenario.key);
                        setStage(scenario.intro);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-5xl">{scenario.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {scenario.title}
                          </h3>
                          {completed ? (
                            <div className="space-y-1">
                              <p className="text-green-600 font-semibold flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Completado: {scoreValue} puntos
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(dateValue).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          ) : (
                            <p className="text-blue-600 font-semibold">
                              🔓 Disponible
                            </p>
                          )}
                        </div>
                      </div>

                      {completed ? (
                        <div className="px-4 py-2 bg-gray-200 rounded-lg">
                          <span className="font-bold text-gray-600">BLOQUEADO</span>
                        </div>
                      ) : (
                        <div className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: '#1e3a5f' }}>
                          <span className="font-bold">REALIZAR →</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER: RESULTS ====================
  if (stage === 'results') {
    const finalMessage = getFinalMessage(score);
    const isBexenClosed = score < 60;
    
    return (
      <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-8" style={{ borderTopColor: '#1e3a5f' }}>
            
            {isBexenClosed ? (
              <div 
                className="relative overflow-hidden rounded-2xl p-10 mb-10 text-white shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #ef4444 100%)' }}
              >
                <div className="relative z-10 text-center">
                  <div className="text-7xl mb-4">💔</div>
                  <h2 className="text-4xl font-black mb-4">¡BEXEN HA CERRADO!</h2>
                  <p className="text-2xl mb-6 font-bold">Has sido víctima de vishing</p>
                  <p className="text-xl opacity-90">Puntuación: {score} puntos</p>
                </div>
              </div>
            ) : (
              <div 
                className="relative overflow-hidden rounded-2xl p-10 mb-10 text-white shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)' }}
              >
                <div className="relative z-10 text-center">
                  <div className="text-7xl mb-4">🎉</div>
                  <h2 className="text-4xl font-black mb-4">¡BEXEN SIGUE OPERANDO!</h2>
                  <p className="text-2xl mb-6 font-bold">Has protegido la empresa</p>
                  <p className="text-xl opacity-90">Puntuación: {score} puntos</p>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1e3a5f' }}>Resultado</h3>
              <p className="text-xl text-gray-700 mb-4">{finalMessage}</p>
              <div className="bg-blue-50 p-6 rounded-xl">
                <p className="text-gray-700">
                  <strong>Puntuación final:</strong> {score} puntos
                </p>
              </div>
            </div>

            <button
              onClick={restartSimulation}
              className="w-full text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 text-xl"
              style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)' }}
            >
              📋 Volver al Selector
            </button>

          </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER: SCENARIO ====================
  const currentScenario = scenarios[stage];

  if (!currentScenario) {
    return <div>Escenario no encontrado</div>;
  }

  return (
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Simulador BEXEN</h1>
                  <p className="text-blue-100">Ciberseguridad</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{score}</div>
                <div className="text-sm text-blue-100">puntos</div>
              </div>
            </div>
          </div>

          {showFeedback && (
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mx-6 mt-6 animate-pulse">
              <p className="font-semibold text-blue-900">{currentFeedback}</p>
            </div>
          )}

          <div className="p-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{currentScenario.title}</h2>
            <p className="text-xl text-gray-600 mb-6">{currentScenario.description}</p>
            <p className="text-xl font-semibold mb-6 text-gray-800">{currentScenario.question}</p>

            <div className="space-y-4">
              {currentScenario.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(option)}
                  disabled={showFeedback}
                  className="w-full p-6 text-left rounded-xl border-2 transition-all hover:border-blue-500 hover:shadow-lg disabled:opacity-50"
                  style={{ 
                    borderColor: showFeedback ? '#cbd5e1' : '#e2e8f0',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <p className="text-lg font-semibold text-gray-800">{option.text}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default VishingSimulator;