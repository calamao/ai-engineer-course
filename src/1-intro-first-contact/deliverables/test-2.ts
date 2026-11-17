import "dotenv/config"; // carga la clave y la dirección del servicio desde .env
import OpenAI from "openai";

const client = new OpenAI(); // lee OPENAI_API_KEY y OPENAI_BASE_URL del entorno
const MODELO = process.env.MODELO ?? "fast";

const text1 = "Explica qué es un LLM en una sola frase."
const text2 = "Propón un nombre para una cafetería"
const text3 = "Imagina que eres el arquitecto principal de una plataforma SaaS financiera que está experimentando una degradación progresiva en los tiempos de respuesta durante las horas pico de negociación bursátil, pasando de una latencia media de 120 milisegundos a más de 2,5 segundos, lo que está provocando caídas en las transacciones críticas de los usuarios y pérdidas económicas directas. Teniendo en cuenta que nuestra infraestructura actual se basa en una arquitectura de microservicios desplegada en contenedores sobre la nube, con bases de datos relacionales que sufren bloqueos por alta concurrencia de escritura y una capa de caché distribuida que parece estar experimentando un alto índice de fallos de acierto, ¿qué estrategia integral paso a paso diseñarías para diagnosticar la causa raíz en tiempo real sin interrumpir el servicio en producción, mitigar el impacto inmediato en los clientes y refactorizar el sistema a medio plazo para garantizar una alta disponibilidad y escalabilidad?"
const text4 = "Explica qué es un LLM en tres párrafos"

const response = await client.chat.completions.create({
  model: MODELO,
  max_completion_tokens: 256, // límite de la respuesta, en tokens
  messages: [
    { role: "user", content: text4 },
  ],
});

// La respuesta llega dentro de una lista de opciones (choices); usamos la primera.
const eleccion = response.choices[0];
console.log(eleccion.message.content || "(respuesta vacía)");

// Por qué terminó: "stop" = de forma natural; "length" = se cortó por el límite.
console.log(`\n[fin] ${eleccion.finish_reason}`);
console.log(
  `[tokens] entrada=${response.usage?.prompt_tokens} salida=${response.usage?.completion_tokens}`,
);