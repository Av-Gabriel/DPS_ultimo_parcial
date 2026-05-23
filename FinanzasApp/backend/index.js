const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'finanzas_db',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.log('Error de conexión:', err);
  } else {
    console.log('MySQL conectado');
  }
});

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});

app.post('/auth/register', (req, res) => {

  console.log('Datos recibidos:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Faltan datos'
    });
  }

  const sql = 'INSERT INTO usuarios (email, password) VALUES (?, ?)';

  db.query(sql, [email, password], (err, result) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: 'Error al registrar usuario'
      });
    }

    return res.json({
      success: true,
      message: 'Usuario registrado correctamente'
    });

  });

});

app.post('/auth/login', (req, res) => {

  console.log('Login recibido:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Faltan credenciales'
    });
  }

  const sql = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';

  db.query(sql, [email, password], (err, result) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: 'Error del servidor'
      });
    }

    if (result.length > 0) {

     return res.json({
  success: true,
  data: {
    token: 'fake-jwt-token',
    user: result[0]
  }
});

    } else {

      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });

    }

  });

});

app.get('/transacciones', (req, res) => {

  const sql = 'SELECT * FROM transacciones ORDER BY fecha DESC';

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: 'Error obteniendo transacciones'
      });
    }

    return res.json({
      success: true,
      data: result
    });

  });

});

app.get('/cuentas', (req, res) => {

  const sql = 'SELECT * FROM cuentas';

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: 'Error obteniendo cuentas'
      });
    }

    return res.json({
      success: true,
      data: result
    });

  });

});


app.get('/presupuestos', (req, res) => {

  const sql = 'SELECT * FROM presupuestos';

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: 'Error obteniendo presupuestos'
      });
    }

    return res.json({
      success: true,
      data: result
    });

  });

});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor en puerto 3000');
});