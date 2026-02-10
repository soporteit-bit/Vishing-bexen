# 🚀 PROYECTO BEXEN - VERSIÓN BASE v1.0

## ✅ QUÉ TIENE ESTA VERSIÓN (TODO FUNCIONAL)

### 🎮 CORE - Simulador
- ✅ 6 escenarios de vishing completos
- ✅ Sistema de puntuación
- ✅ Decisiones ramificadas
- ✅ Feedback inmediato
- ✅ Pantalla de resultados

### 👤 SISTEMA DE USUARIOS
- ✅ Login con nombre
- ✅ Tracking individual
- ✅ Cada escenario solo UNA vez
- ✅ Progreso visual (X/6)
- ✅ Datos guardados en localStorage

### 🔐 PANEL DE ADMINISTRACIÓN
- ✅ Login de admin protegido (usuario: admin, password: bexen2024)
- ✅ Acceso independiente desde login principal
- ✅ Estadísticas globales (4 tarjetas)
- ✅ Leaderboard Top 10
- ✅ Tabla completa de participantes
- ✅ Búsqueda y filtros
- ✅ Ordenar datos
- ✅ Exportar CSV
- ✅ Resetear todos los datos
- ✅ Cerrar sesión

### 🎨 DISEÑO
- ✅ Branding BEXEN completo
- ✅ Colores corporativos
- ✅ Responsive
- ✅ Animaciones suaves
- ✅ Confetti en éxitos

---

## 📊 ESCENARIOS INCLUIDOS

1. **🏦 Banco** - Fraude detectado
2. **💻 Soporte Técnico** - Virus falso
3. **📋 Agencia Tributaria** - Deuda fiscal
4. **👨‍👩‍👦 Familiar** - Emergencia falsa
5. **📦 Paquetería** - Paquete retenido
6. **💼 CEO** - CEO Fraud (avanzado)

---

## 🔑 CREDENCIALES

### Admin:
- **Usuario:** admin
- **Contraseña:** bexen2024

---

## 📁 ESTRUCTURA DEL CÓDIGO

### Estados Principales:
```javascript
- login          → Entrada de nombre
- admin_login    → Login de admin
- scenario_select → Selector de escenarios
- admin_panel    → Panel de administración
- results        → Resultados finales
- [escenarios]   → 6 escenarios interactivos
```

### Funciones Clave:
```javascript
loadUserData()        → Carga datos del usuario
saveUserResult()      → Guarda resultado de escenario
handleLogin()         → Login de usuario
handleAdminLogin()    → Login de admin
handleAdminLogout()   → Cerrar sesión admin
loadAllUsersData()    → Carga todos los usuarios (admin)
calculateGlobalStats() → Estadísticas globales
getLeaderboard()      → Ranking de usuarios
exportToCSV()         → Exporta datos a CSV
resetAllData()        → Borra todos los datos
```

---

## 💾 DATOS EN localStorage

### Por Usuario:
```javascript
"bexen-results:juan-perez": {
  bank: {completado: true, score: 75, fecha: "2024-12-20"},
  tech: {completado: true, score: 65, fecha: "2024-12-20"},
  ceo: null,
  // ...
}
```

### Global:
```javascript
"bexen-admin:users-list": ["juan-perez", "maria-lopez", ...]
```

---

## 🚀 CÓMO DESPLEGAR

### 1. Reemplaza el archivo
```bash
# Borra tu archivo viejo
rm vishing-simulator.jsx

# Descarga el nuevo: vishing-simulator-v1-base.jsx
# Renómbralo a: vishing-simulator.jsx
```

### 2. Sube a Git
```bash
git add vishing-simulator.jsx
git commit -m "v1.0 Base: Proyecto limpio desde cero"
git push
```

### 3. Vercel despliega automáticamente
```
Espera 1-2 minutos
Abre: https://vishing-simulator.vercel.app
```

---

## ✅ PRUEBAS BÁSICAS

### Test 1: Login Usuario
```
1. Abre la página
2. Ingresa nombre: "Test Usuario"
3. Click "Comenzar Formación"
4. Deberías ver selector con 6 escenarios
```

### Test 2: Hacer un Escenario
```
1. Click en "🏦 Banco"
2. Completa las decisiones
3. Llega a pantalla de resultados
4. Click "Volver al Selector"
5. Escenario Banco ahora BLOQUEADO
```

### Test 3: Login Admin
```
1. Vuelve a la página principal
2. Click "🔐 Acceso Admin"
3. Usuario: admin
4. Contraseña: bexen2024
5. Click "Acceder al Panel"
6. Deberías ver panel de admin con estadísticas
```

### Test 4: Panel Admin
```
1. En panel de admin
2. Verifica estadísticas (4 tarjetas)
3. Verifica tabla de usuarios
4. Click "📥 CSV" para exportar
5. Click "🔓 Cerrar Sesión"
```

---

## 🎯 LO QUE NO TIENE (Podemos añadir después)

### Fase 2: Mejoras Visuales
- ❌ Gráficos (Chart.js)
- ❌ Distribución de puntuaciones
- ❌ Stats por escenario

### Fase 3: Detalles
- ❌ Click en usuario → ver detalle completo
- ❌ Historial de decisiones guardado
- ❌ Red flags por usuario

### Fase 4: Gamificación
- ❌ Certificados al completar 6/6
- ❌ Badges y logros
- ❌ Compartir resultados

### Fase 5: Backend Real
- ❌ Base de datos
- ❌ API REST
- ❌ Múltiples admins
- ❌ Datos compartidos entre dispositivos

---

## 🔧 CONFIGURACIÓN

### Cambiar Credenciales Admin:
```javascript
// Línea ~43
const ADMIN_CREDENTIALS = {
  username: 'admin',     // ← Cambia aquí
  password: 'bexen2024'  // ← Cambia aquí
};
```

### Cambiar Colores BEXEN:
```javascript
// Línea ~45
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
```

---

## 📊 MÉTRICAS

- **Líneas de código:** ~1,500
- **Escenarios:** 6
- **Pantallas:** 7
- **Funciones:** 15+
- **localStorage keys:** 2 tipos

---

## ⚠️ LIMITACIONES CONOCIDAS

### localStorage:
- Solo en el navegador actual
- No compartido entre usuarios
- Límite ~5-10MB
- Se borra si usuario limpia caché

### Seguridad:
- Credenciales admin en código
- Sin encriptación real
- Solo para uso interno

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

### Prioridad 1: Gráficos
- Añadir Chart.js
- Visualizaciones en panel admin
- Distribución de puntuaciones

### Prioridad 2: Detalles Usuario
- Modal al click en usuario
- Ver historial completo
- Decisiones tomadas

### Prioridad 3: Certificados
- PDF al completar 6/6
- Gamificación
- Compartir logros

---

## 🐛 SI HAY PROBLEMAS

### Vercel no despliega:
```
1. Ve a: https://vercel.com/dashboard
2. Click en tu proyecto
3. Ve a "Deployments"
4. Click en el último
5. Ve a "Build Logs"
6. Copia el error aquí
```

### El archivo no se ve:
```bash
# Verifica que se subió
git log --oneline -1

# Verifica en GitHub
# Ve al repo y busca el archivo
```

### localStorage no funciona:
```
Abre consola del navegador (F12)
Escribe: localStorage.getItem('bexen-admin:users-list')
Debería mostrar algo o null
```

---

## ✅ CHECKLIST POST-DEPLOY

Después de subir:

- [ ] Página carga correctamente
- [ ] Login de usuario funciona
- [ ] Escenarios se pueden jugar
- [ ] Resultados se guardan
- [ ] Escenarios quedan bloqueados
- [ ] Botón "Acceso Admin" visible
- [ ] Login admin funciona (admin/bexen2024)
- [ ] Panel admin se ve correctamente
- [ ] Tabla muestra usuarios
- [ ] CSV se puede exportar
- [ ] Cerrar sesión funciona

---

## 📞 SOPORTE

Si algo no funciona:

1. Copia el error exacto
2. Dime qué estabas haciendo
3. Dime qué esperabas que pasara
4. Lo solucionamos en 2 minutos

---

**Versión:** 1.0 - Base Limpia  
**Fecha:** Diciembre 2024  
**Estado:** ✅ LISTO PARA PRODUCCIÓN  
**Próximo:** Añadir gráficos (cuando quieras)

🎉 **Proyecto Base Completamente Funcional**
