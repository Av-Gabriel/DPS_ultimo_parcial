const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
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

app.post('/transacciones', (req, res) => {

  const {
    usuario_id,
    monto,
    tipo,
    categoria,
    cuenta,
    descripcion,
    fecha
  } = req.body;

  const sql = `
    INSERT INTO transacciones
    (usuario_id, monto, tipo, categoria, cuenta, descripcion, fecha)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [usuario_id, monto, tipo, categoria, cuenta, descripcion, fecha],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false
        });
      }

      return res.json({
        success: true
      });

    });
});

app.delete('/transacciones/:id', (req, res) => {

  const { id } = req.params;

  db.query(
    'DELETE FROM transacciones WHERE id = ?',
    [id],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false
        });
      }

      return res.json({
        success: true
      });

    });
});

app.post('/cuentas', (req, res) => {

  const { usuario_id, nombre } = req.body;

  db.query(
    'INSERT INTO cuentas (usuario_id, nombre) VALUES (?, ?)',
    [usuario_id, nombre],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false
        });
      }

      return res.json({
        success: true
      });

    });
});


app.delete('/cuentas/:id', (req, res) => {

  const { id } = req.params;

  db.query(
    'DELETE FROM cuentas WHERE id = ?',
    [id],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false
        });
      }

      return res.json({
        success: true
      });

    });
});

app.post('/presupuestos', (req, res) => {

  const {
    usuario_id,
    categoria,
    limite,
    mes,
    anio
  } = req.body;

  const sql = `
    INSERT INTO presupuestos
    (usuario_id, categoria, limite, mes, anio)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [usuario_id, categoria, limite, mes, anio],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false
        });
      }

      return res.json({
        success: true
      });

    });
});

app.delete('/presupuestos/:id', (req, res) => {

  const { id } = req.params;

  db.query(
    'DELETE FROM presupuestos WHERE id = ?',
    [id],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false
        });
      }

      return res.json({
        success: true
      });

    });
});

app.listen(3000, () => {
  console.log('Servidor en puerto 3000');
});