const net = require('net');

// Función para generar el código ZPL
function generateZPL(sku, descripcion, color, size, qty, fecha, codigo, numeroEtiqueta) {
    // Formatear la fecha y generar el código final
    const [year, month, day] = fecha.split('-');
    const fechaFormateada = `${day}${month}${year.slice(2)}$${sku}$${qty}`;
    const codigoFinal = `${fechaFormateada}$${numeroEtiqueta.toString().padStart(3, '0')}`;
    const fechaFormateadaBonita = `${day}-${month}-${year}`;
    const hora = new Date().toTimeString().split(' ')[0];
    const fechaHora = `${fechaFormateadaBonita} ${hora}`;


    return `
^XA
^FO50,50
^A0N,30,30
^FDSKU: ${sku}^FS  // SKU

^FO50,100
^A0N,30,30
^FDDescrip: ${descripcion}^FS  // Descripción

^FO50,150
^A0N,30,30
^FDColor: ${color}^FS  // Color

^FO50,200
^A0N,30,30
^FDSize: ${size}^FS  // Tamaño

^FO50,250
^A0N,30,30
^FDQty: ${qty}^FS  // Cantidad

^FO50,300
^A0N,30,30
^FD${fechaHora}^FS  // Fecha con hora abajo en la izquierda

// Colocando el código QR a la derecha
^FO350,130
^BQ,2,5  // Ajuste del tamaño del QR
^FDQA,${codigoFinal}^FS  // Código QR con la cadena de datos

// Centrado del código debajo del QR
^FO250,270
^A0N,20,20
^FD${codigoFinal}^FS

// Línea separadora inferior
^FO50,370
^GB500,0,8^FS  // Línea separadora inferior
^XZ
    `;
}

// Función para enviar el ZPL a la impresora Zebra
function printLabel(sku, descripcion, color, size, qty, fecha, codigo, numeroEtiqueta, printerIp = '172.16.115.213', printerPort = 9100) {
    const client = new net.Socket();
    const zpl = generateZPL(sku, descripcion, color, size, qty, fecha, codigo, numeroEtiqueta);

    client.connect(printerPort, printerIp, () => {
        console.log('Conectado a la impresora Zebra');
        client.write(zpl);
        client.end();
    });

    client.on('data', (data) => {
        console.log('Respuesta de la impresora:', data.toString());
    });

    client.on('close', () => {
        console.log('Conexión cerrada');
    });

    client.on('error', (error) => {
        console.error('Error en la conexión:', error.message);
    });
}

module.exports = { printLabel };
