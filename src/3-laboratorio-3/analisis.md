1. Cuántas de las 10 ejecuciones con chaos necesitaron reintentos y si alguna se rindió.
   3 de 10 necesitaron reintentos. 1 de ellas llegó al 4o reintento y falló.

2. Por qué las esperas entre reintentos tienen que ser aleatorias.
   Para evitar que otros clientes que siguen el mismo patrón de reintentos (o incluso nosotros mismos en varias peticiones) caigan al mismo tiempo en los reintentos, lo cual saturaría al sistema.

3. Por qué has desactivado los reintentos de la librería.
   Porque quiero tener yo el control de los reintentos y sino por cada uno de mis reintentos tendría los n reintentos de la librería.
