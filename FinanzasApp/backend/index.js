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

// ── AUTH ──────────────────────────────────────────
app.post('/auth/register', (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Faltan datos' });
  }

  db.query('INSERT INTO usuarios (email, password) VALUES (?, ?)', [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'Error al registrar usuario' });
    }
    return res.json({ success: true, message: 'Usuario registrado correctamente' });
  });
});

app.post('/auth/login', (req, res) => {
  console.log('Login recibido:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Faltan credenciales' });
  }

  db.query('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'Error del servidor' });
    }

    if (result.length > 0) {
      const usuario = result[0];
      // Guardamos el id real del usuario en el token (simple, sin JWT)
      return res.json({
        success: true,
        data: {
          token: `token-${usuario.id}`,
          user: usuario
        }
      });
    } else {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  });
});

// ── Helper para extraer usuario_id del token ──────
function getUserId(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '');
  // token es "token-{id}"
  const id = parseInt(token.replace('token-', ''));
  return isNaN(id) ? null : id;
}

// ── CUENTAS ───────────────────────────────────────
app.get('/cuentas', (req, res) => {
  const usuario_id = getUserId(req);
  if (!usuario_id) return res.status(401).json({ success: false, message: 'No autorizado' });

  db.query('SELECT * FROM cuentas WHERE usuario_id = ?', [usuario_id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Error obteniendo cuentas' });
    return res.json({ success: true, data: result });
  });
});

app.post('/cuentas', (req, res) => {
  const usuario_id = getUserId(req);
  if (!usuario_id) return res.status(401).json({ success: false, message: 'No autorizado' });

  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ success: false, message: 'Falta el nombre' });

  db.query('INSERT INTO cuentas (nombre, usuario_id) VALUES (?, ?)', [nombre, usuario_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'Error al crear cuenta' });
    }
    res.json({ success: true, data: { id: result.insertId, nombre, usuario_id } });
  });
});

app.delete('/cuentas/:id', (req, res) => {
  const usuario_id = getUserId(req);
  if (!usuario_id) return res.status(401).json({ success: false, message: 'No autorizado' });

  db.query('DELETE FROM cuentas WHERE id = ? AND usuario_id = ?', [req.params.id, usuario_id], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Error al eliminar cuenta' });
    res.json({ success: true });
  });
});

// ── PRESUPUESTOS ──────────────────────────────────
app.get('/presupuestos', (req, res) => {
  const usuario_id = getUserId(req);
  if (!usuario_id) return res.status(401).json({ success: false, message: 'No autorizado' });

  db.query('SELECT * FROM presupuestos WHERE usuario_id = ?', [usuario_id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Error obteniendo presupuestos' });
    return res.json({ success: true, data: result });
  });
});

app.post('/presupuestos', (req, res) => {
  const usuario_id = getUserId(req);
  if (!usuario_id) return res.status(401).json({ success: false, message: 'No autorizado' });

  const { categoria, limite, mes, anio } = req.body;
  if (!categoria || !limite) return res.status(400).json({ success: false, message: 'Faltan datos' });

  db.query(
    'INSERT INTO presupuestos (categoria, limite, mes, anio, usuario_id) VALUES (?, ?, ?, ?, ?)',
    [categoria, limite, mes, anio, usuario_id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error al crear presupuesto' });
      }
      res.json({ success: true, data: { id: result.insertId, categoria, limite, mes, anio, usuario_id } });
    }
  );
});

app.delete('/presupuestos/:id', (req, res) => {
  const usuario_id = getUserId(req);
  if (!usuario_id) return res.status(401).json({ success: false, message: 'No autorizado' });

  db.query('DELETE FROM presupuestos WHERE id = ? AND usuario_id = ?', [req.params.id, usuario_id], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Error al eliminar presupuesto' });
    res.json({ success: true });
  });
});

// ── TRANSACCIONES ─────────────────────────────────
app.get('/transacciones', (req, res) => {
  const usuario_id = getUserId(req);
  if (!usuario_id) return res.status(401).json({ success: false, message: 'No autorizado' });

  db.query('SELECT * FROM transacciones WHERE usuario_id = ? ORDER BY fecha DESC', [usuario_id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Error obteniendo transacciones' });
    return res.json({ success: true, data: result });
  });
});

app.post('/transacciones', (req, res) => {
  const usuario_id = getUserId(req);
  if (!usuario_id) return res.status(401).json({ success: false, message: 'No autorizado' });

  const { categoria, cuenta, descripcion, fecha, monto, tipo } = req.body;
  if (!categoria || !monto || !tipo) return res.status(400).json({ success: false, message: 'Faltan datos' });

  db.query(
    'INSERT INTO transacciones (categoria, cuenta, descripcion, fecha, monto, tipo, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [categoria, cuenta, descripcion || null, fecha || new Date().toISOString().split('T')[0], monto, tipo, usuario_id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error al crear transaccion' });
      }
      res.json({ success: true, data: { id: result.insertId } });
    }
  );
});

app.put('/transacciones/:id', (req, res) => {
  const usuario_id = getUserId(req);
  if (!usuario_id) return res.status(401).json({ success: false, message: 'No autorizado' });

  const { categoria, cuenta, descripcion, fecha, monto, tipo } = req.body;

  db.query(
    'UPDATE transacciones SET categoria=?, cuenta=?, descripcion=?, fecha=?, monto=?, tipo=? WHERE id=? AND usuario_id=?',
    [categoria, cuenta, descripcion || null, fecha, monto, tipo, req.params.id, usuario_id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error al actualizar transaccion' });
      }
      res.json({ success: true });
    }
  );
});

app.delete('/transacciones/:id', (req, res) => {
  const usuario_id = getUserId(req);
  if (!usuario_id) return res.status(401).json({ success: false, message: 'No autorizado' });

  db.query('DELETE FROM transacciones WHERE id = ? AND usuario_id = ?', [req.params.id, usuario_id], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Error al eliminar transaccion' });
    res.json({ success: true });
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor en puerto 3000');
});
