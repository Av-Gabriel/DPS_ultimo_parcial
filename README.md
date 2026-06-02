# FinanzasApp

Aplicación móvil desarrollada en React Native para la gestión de finanzas personales. Permite registrar ingresos y gastos, administrar múltiples cuentas, definir presupuestos mensuales y visualizar estadísticas financieras mediante un dashboard interactivo.

---

## Descripción del proyecto

FinanzasApp fue desarrollada como parte del Desafío Práctico #3 de la asignatura **Diseño y Programación de Software Multiplataforma**.

El objetivo principal es proporcionar una herramienta sencilla y eficiente para que los usuarios puedan llevar un control detallado de sus finanzas personales desde un dispositivo móvil.

La aplicación permite:

* Registrar ingresos y gastos.
* Gestionar múltiples cuentas financieras.
* Definir presupuestos por categoría.
* Visualizar estadísticas financieras.
* Consultar balances actualizados en tiempo real.
* Mantener la sesión del usuario mediante autenticación.

---

## Tecnologías utilizadas

### Frontend

* React Native
* Expo
* React Navigation
* AsyncStorage
* Fetch API

### Backend

* Node.js
* Express.js
* JSON Web Token (JWT)

### Base de datos

* MySQL

---

## Arquitectura general

```text
React Native (Frontend)
        │
        ▼
REST API (Express)
        │
        ▼
MySQL Database
```

La aplicación móvil consume una API REST desarrollada con Express, encargada de procesar las solicitudes del usuario y comunicarse con la base de datos MySQL.

---

## Funcionalidades implementadas

### Autenticación

* Registro de usuarios.
* Inicio de sesión.
* Persistencia de sesión.
* Cierre de sesión.

### Gestión de transacciones

* Crear transacciones.
* Editar transacciones.
* Eliminar transacciones.
* Registro de:

  * Monto
  * Tipo (Ingreso/Gasto)
  * Categoría
  * Cuenta
  * Fecha
  * Descripción

### Gestión de cuentas

* Crear cuentas personalizadas.
* Asociación de transacciones a cuentas específicas.

### Presupuestos

* Creación de presupuestos mensuales por categoría.
* Administración de límites de gasto.

### Dashboard

* Balance general.
* Total de ingresos.
* Total de gastos.
* Últimas transacciones.
* Gráfica de distribución de gastos por categoría.

---

## Características principales

 CRUD completo de transacciones

 Gestión de múltiples cuentas

 Dashboard financiero

 Persistencia de sesión

 API REST propia

 Base de datos MySQL

 Navegación mediante Tabs y Stack Navigation

 Interfaz móvil responsive

---

## Instalación

### Clonar repositorio

```bash
git clone https://github.com/Av-Gabriel/DPS_ultimo_parcial.git
```

### Instalar dependencias del frontend

```bash
npm install
```

### Instalar dependencias del backend

```bash
cd backend
npm install
```

---

## Ejecución

### Backend

```bash
cd backend
node index.js
```

### Frontend

```bash
npx expo start
```

---

## 📂 Estructura del proyecto

```text
FinanzasApp
│
├── backend
│   ├── routes
│   ├── controllers
│   ├── middleware
│   ├── config
│   └── index.js
│
├── src
│   ├── screens
│   ├── components
│   ├── navigation
│   ├── services
│   └── utils
│
├── App.js
└── package.json
```

---

Proyecto académico desarrollado para la asignatura:

**Diseño y Programación de Software Multiplataforma**

Universidad Don Bosco

Ciclo 01 - 2026

---

Estado del proyecto

 Proyecto funcional

 Integración completa entre frontend y backend

 Persistencia de datos en MySQL

 Dashboard operativo

 Gestión de transacciones, cuentas y presupuestos
