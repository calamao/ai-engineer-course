# Analysis and test results

## Test table

| Case | Task | Input | Model | Input tokens | Output tokens | Result correct? | Notes |
| --- | --- | --- | --- | ---: | ---: | --- | --- |
| Short sample | summarizer | short text | fast | 57 | 158 | yes | good key points |
| Medium sample | summarizer | medium text | fast | 123 | 135 | yes | good key points |
| Long sample | summarizer | long text | fast | 200 | 256 | yes | good key points |
| Medium repeat #1 | summarizer | medium text | fast | 57 | 137 | yes | repeat run: result changes |
| Medium repeat #2 | summarizer | medium text | fast | 57 | 122 | yes | repeat run: result changes |

## Analysis

### Question 1
Tokens: ¿cómo crece el consumo con la longitud del texto? ¿Qué parte del consumo controlas tú con el límite de longitud y qué parte no?

Respuesta: está claro que la parte de los input tokens se incrementa con la longitud del texto y por tanto el consumo total de tokens. La parte de output tokens no queda tan clara que aumente necesariamente con la longitud del texto de entrada.
Con el límite de longitud controlamos los tokens de salida (aunque la respuesta puede quedar incompleta y no usable). Con dicho límite no controlamos los input tokens (texto de entrada, system prompt y los tokens de "reasoning" del modelo)

### Question 2
Variabilidad: ¿cambió el resultado entre ejecuciones? ¿Qué cambiarías en las instrucciones para hacerlo más estable?

Respuesta:
Sí cambió el resultado entre ejecuciones.
Dos cosas se me ocurren cambiar para hacerlo más estable:
1. Temperatura: bajarla a 0 para disminuir la "creatividad"
2. cambiar el prompt de sistema para ser todavía más específico y con muchas más restricciones para que el modelo tenga mucha menos libertad en la respuesta.

### Question 3
Trade-offs: ¿por qué el modelo que has elegido es suficiente para esta tarea? ¿Qué cambiarías si la tarea tuviera que procesar 10.000 textos al día?

Respuesta:
Parece que el modelo "fast" es capaz de cumplir la tarea "Resumidor" para los 3 textos de entrada contemplados.  
Si tuviera que procesar muchos más textos al día tendría que monitorizar el coste y la calidad de las respuestas con diferentes modelos.
Reducir coste prodría implicar cambiar el modelo, cachear respuestas. Añadir modelo de validador de entrada para ver si dicha entrada puede ser consumida por el modelo final.

# Optional

Two executions:
`npm run practice-2 -- --sample medium --model fast`
`npm run practice-2 -- --sample medium --model smart`

## Table
| Case | Task | Input | Model | Input tokens | Output tokens | Time | Result correct? | Notes |
| --- | --- | --- | --- | ---: | ---: | --- | --- | --- |
| Medium sample | summarizer | medium text | fast | 123 | 259 | 1764 ms | yes | good key points |
| Medium sample | summarizer | medium text | smart | 123 | 126 | 2690 ms | yes | good key points |

## Results

Fast model:
```
# Three Key Points

1. **Specific Issue Pattern**: The invoice total error only occurs for orders above $250 with annual plan selection—this narrow scope suggests a targeted bug rather than a systemic calculation problem.

2. **Backend vs. Frontend Problem**: Since backend calculations are confirmed correct, the issue lies in the email formatting/display layer, meaning the data is accurate but being presented incorrectly to customers.

3. **High-Impact Scope**: The problem directly affects customer trust and billing clarity, explaining the spike in support tickets and requiring urgent attention to the email receipt generation system.
```

Smart model:
```
# Tres puntos clave:

1. **Problema específico**: Los totales de factura son incorrectos en los emails de confirmación (no en el dashboard), afectando solo a pedidos superiores a $250 con plan anual.

2. **Origen del error**: El backend calcula correctamente; el problema está en la capa de formateo que genera los emails de recibo.

3. **Impacto**: Aumento significativo de tickets de soporte desde el lanzamiento de la nueva página de precios.
```

## Conclusions
¿compensa el modelo más grande para esta tarea?

Datos:
* El tiempo de ejecución se ha incrementado casi 1 segundo.
* Curiosamente el consumo de tokens no ha aumentado, incluso ha bajado con el smart (en otras ejecuciones repetidas estaban a al par)
* Respuestas:
    * El modelo fast por ser mi texto de entrada en inglés responde en inglés un resumen bastante menos conciso.
    * El modelo smart elige el español (claramente debido a que el system prompt está en español) y el texto es mucho más conciso (por razones que no quiero elucubrar)

Conclusión:
En base a lo anterior es un tanto inconcluso pero si añadimos que el modelo "smart" será muy probablemente más caro en costes podríamos concluir que:
No, no compensa el modelo "smart" para esta tarea.
