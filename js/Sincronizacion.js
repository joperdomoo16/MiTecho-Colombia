// Sincronización y copia de respaldo de los datos financieros y registros diarios en la nube

// Organiza los datos del perfil y los movimientos diarios para guardarlos en la cuenta
function Prepararrespaldonube(s, c) {
  const o = {};
  STORE_FIELDS.forEach(k => { if (k !== 'gsUrl') o[k] = s[k]; });
  return {
    action: 'sync',
    email: s.email,
    perfil: {
      nombre: s.nombre,
      ciudad: s.ciudad,
      tipo: s.tipo,
      ingreso: Math.round(c.ing),
      deudas: Math.round(c.deu),
      cupo: Math.round(c.precio),
      puedeCerrar: Math.round(c.precioHoy),
      modalidad: s.mod
    },
    registros: s.entries.map(e => ({ tipo: 'ingreso', concepto: e.concepto, fuente: e.fuente, medio: e.medio, monto: e.monto, hora: e.hora }))
      .concat(s.expenses.map(e => ({ tipo: 'gasto', concepto: e.nombre || e.cat, fuente: e.cat, medio: e.medio, monto: e.monto, hora: e.hora }))),
    estado: o
  };
}

async function Enviarrespaldonube(url, payload, method, email) {
  if (typeof EstadoSesionActual === 'function' && EstadoSesionActual().autenticado) {
    if (method === 'GET') {
      const res = await ObtenerPerfilApi();
      if (!res.ok || !Array.isArray(res.datos) || !res.datos.length) {
        throw new Error('No se encontró una copia en la nube para ' + (email || 'tu cuenta') + '.');
      }
      const p = res.datos[0];
      return {
        ok: true,
        estado: {
          nombre: p.nombre || '',
          edad: p.edad,
          ciudad: p.ciudad || 'Bogotá',
          tipo: p.tipo_ingreso || 'fijo',
          fijo: p.fijo || 0,
          variable: p.variable || 0,
          ahorro: p.ahorro || 0,
          ahorroMes: p.ahorro_mes || 0,
          caja: !!p.afiliado_caja,
          cajaNombre: p.caja_nombre || '',
          sisben: !!p.sisben,
          sisbenGrupo: p.sisben_grupo || 'A1-C8',
          mod: p.modalidad || 'vis',
          rate: p.tasa_tipo || 'pesos',
          term: p.plazo_anios || 20,
          pareja: !!p.pareja,
          parejaNombre: p.pareja_nombre || '',
          parejaIng: p.pareja_ing || 0,
          parejaDeu: p.pareja_deu || 0,
          setupDone: true
        }
      };
    }

    const s = (payload && payload.estado) || {};
    const resPerfil = await GuardarPerfilApi({
      nombre: s.nombre || '',
      edad: s.edad,
      ciudad: s.ciudad || 'Bogotá',
      tipo_ingreso: s.tipo || 'fijo',
      fijo: s.fijo || 0,
      variable: s.variable || 0,
      ahorro: s.ahorro || 0,
      ahorro_mes: s.ahorroMes || 0,
      afiliado_caja: !!s.caja,
      caja_nombre: s.cajaNombre || '',
      sisben: !!s.sisben,
      sisben_grupo: s.sisbenGrupo || 'A1-C8',
      modalidad: s.mod || 'vis',
      tasa_tipo: s.rate || 'pesos',
      plazo_anios: s.term || 20,
      pareja: !!s.pareja,
      pareja_nombre: s.parejaNombre || '',
      pareja_ing: s.parejaIng || 0,
      pareja_deu: s.parejaDeu || 0
    });
    if (!resPerfil.ok) {
      throw new Error(resPerfil.error || 'No se pudo sincronizar el perfil con la nube.');
    }
    const entradas = s.entries || [];
    const egresos = s.expenses || [];
    if (entradas.length || egresos.length) {
      await SincronizarRegistrosApi(entradas, egresos).catch(() => null);
    }
    return { ok: true, nuevos: entradas.length + egresos.length };
  }

  const cleanUrl = (url || '').trim();
  if (!/^https:\/\/script\.google(usercontent)?\.com\//.test(cleanUrl)) {
    throw new Error('Inicia sesión con tu cuenta para sincronizar tus datos en la nube.');
  }
  const r = method === 'GET'
    ? await fetch(cleanUrl + (cleanUrl.includes('?') ? '&' : '?') + 'email=' + encodeURIComponent(email || ''))
    : await fetch(cleanUrl, { method: 'POST', body: JSON.stringify(payload) });
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || 'No se pudo completar la sincronización.');
  return j;
}
