Implement an adapter for different AI SDKs (initially OpenAI and Anthropic)

# Requirements

- Un contrato propio. La aplicación pide un modelo (por ejemplo, rapido), no un modelo de un proveedor, y recibe siempre la misma respuesta, venga de donde venga: el texto, el motivo de parada, los tokens, el modelo y el destino que respondió.

- Un adaptador por formato. Cada adaptador traduce entre tu contrato y una API, y es el único sitio donde se nota la diferencia entre proveedores.

- La configuración manda, no el código. Un [config.json](./config.json) dice qué modelo real tiene cada modelo de tu aplicación, en orden

- Un plan de fallbacks. Si un destino falla con un error pasajero (429, 5xx o timeout), el cliente prueba el siguiente de la lista. Si falla por la petición (un 400), no: fallaría igual en cualquier otro destino, y probarlo solo gasta tiempo y presupuesto.
