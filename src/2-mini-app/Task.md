Requisitos para la tarea:
* Genera el código y comentarios en inglés
* Haz el código en Typescript (olvida Python)
* Haz el código en este mismo "folder" y prepáralo para ejecutarse con un script de npm igual que el ya existente `practice-1`
* Haz el código para yo poder luego contestar a las preguntas que se plantean, no las respondas directamente. Quiero el output necesario para yo poder evaluar los resultados.
* Genera los 3 diferentes textos de entrada (corto, medio y largo) que me puedan servir para contestar a las preguntas.
* Crea parámetros de entrada opcionales si crees que puede ayudar a ejecutar alguna variante de los ejercicios.
* Para llamar al modela de IA utiliza código parecido al utilizado aquí:
[text](../1-intro-first-contact/test-2.ts)
* El código que pueda ser reutilizable para procesar parámetros de los comandos puedes dejarlo en una carpeta o package a parte. Utiliza package externos si lo consideras necesario para eliminar boiler-plate.
* Implenta la parte opcional también, puedes medir los tiempos de ejecución y que sean parte del output de salida como los tokens consumidos.
    * otro parámetro de entrada puede ser el modelo ("fast", "smart", etc)



Enunciado
Actividades a realizar
Construir una aplicación de línea de comandos que reciba un texto y use un modelo para resolver una de estas tareas:

Resumidor: devuelve tres puntos clave de un texto largo.
Clasificador: etiqueta un mensaje con una categoría (por ejemplo, la de un ticket de soporte).
Extractor: devuelve un dato concreto de un texto (un nombre, una fecha o un importe).

La aplicación debe cumplir estos criterios de aceptación:

Funciona con el texto como argumento y con el contenido de un archivo.
Si no recibe texto, explica cómo se usa y termina.
Separa las instrucciones fijas de la tarea (en el system prompt) del texto del usuario.
Muestra el resultado y el consumo de tokens de la llamada.
Avisa si la respuesta se cortó por el límite de longitud (motivo de fin length).
Lee la clave del .env: no aparece en el código.
Pistas para empezar:

Añadir un mensaje con el rol system al principio de la lista de mensajes. Contiene las instrucciones fijas de tu tarea; el texto del usuario va en el mensaje user, que cambia en cada uso:

mensajes = [
    { rol: "system", contenido: "Resume textos. Devuelve exactamente 3 puntos clave, concisos, en español." },
    { rol: "user",   contenido: texto }
]
Leer el texto del primer argumento de la línea de comandos o, si no hay, de la entrada estándar. Así funcionan las dos formas de uso:

npx tsx miniApp.ts "Texto que quieres procesar"   # TypeScript: texto como argumento
npx tsx miniApp.ts < texto.txt                    # TypeScript: texto desde un archivo
El motivo de fin (finish_reason) y el consumo (usage) impresos en pantalla.

Pruebas con datos reales
Preparar tres textos de entrada distintos, sin datos personales: uno corto, uno medio y uno largo.
Ejecutar la mini-app con cada texto y anotar en una tabla: tokens de entrada, tokens de salida y si el resultado es correcto.
Ejecutar dos veces más el texto medio y anotar si el resultado cambia.
Análisis
Responder en un párrafo corto a cada pregunta:

Tokens: ¿cómo crece el consumo con la longitud del texto? ¿Qué parte del consumo controlas tú con el límite de longitud y qué parte no?
Variabilidad: ¿cambió el resultado entre ejecuciones? ¿Qué cambiarías en las instrucciones para hacerlo más estable?
Trade-offs: ¿por qué el modelo que has elegido es suficiente para esta tarea? ¿Qué cambiarías si la tarea tuviera que procesar 10.000 textos al día?

Reto opcional: comparar dos modelos
Ejecutar la misma tarea con MODELO=fast y con MODELO=smart, cambiando esa línea del .env entre una ejecución y otra.
Comparar calidad del resultado, consumo y tiempo de respuesta. Para medir el tiempo, puedes anteponer time al comando en macOS y Linux, o usar Measure-Command en PowerShell.
Concluir: ¿compensa el modelo más grande para esta tarea?

📦 Entregable
El estudiante deberá enviar un archivo .zip que contenga:

💻 El código fuente de la mini-app, con un README breve que explique cómo ejecutarla y cómo configurar el .env.
📸 Capturas de la terminal mostrando:
Una ejecución con el texto como argumento.
Una ejecución con un archivo.
Una ejecución sin texto, donde se vea el mensaje de uso.
Un aviso de corte (baja el límite de longitud para provocarlo).
📄 Un archivo analisis.md con la tabla de pruebas y las respuestas del análisis (y del reto opcional, si lo haces).
⚠️ Las capturas deben ser claras y legibles.

🔒 Buenas prácticas
No incluir el archivo .env en el .zip. Si quieres documentar la configuración, incluye un .env.example sin la clave.
No mostrar la clave en las capturas ni en el código. Si aparece, ocúltala antes de enviar.
No incluir carpetas de dependencias (node_modules, entornos virtuales de Python).
No usar textos con datos personales o confidenciales en las pruebas: se envían a un servicio externo.