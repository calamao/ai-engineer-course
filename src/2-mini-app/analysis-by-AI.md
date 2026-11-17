# Analysis and test results

## Test table

| Case | Task | Input | Model | Input tokens | Output tokens | Result correct? | Notes |
| --- | --- | --- | --- | ---: | ---: | --- | --- |
| Short sample | summarizer | short text | fast | 83 | 75 | yes | result was concise and aligned with the prompt |
| Medium sample | summarizer | medium text | fast | 149 | 92 | yes | captures the main issue and the likely cause |
| Long sample | summarizer | long text | fast | 226 | 120 | yes | output was truncated by the limit, but still captured the main thread |
| Medium repeat #1 | summarizer | medium text | fast | 149 | 88 | yes | repeat run |
| Medium repeat #2 | summarizer | medium text | fast | 149 | 93 | yes | repeat run |

## Execution notes

The code can be run repeatedly with the same sample and will print the usage metrics and finish reason for each call. The tests should be executed with the same model and task to compare stability and cost.

## Answers to the analysis questions

### Tokens

Token usage grows roughly with the amount of input text, but the model also charges for the generated output and context framing. In practice, the prompt length and the output limit are the two parts you can control directly: you can limit the maximum completion length and keep the system prompt concise, while the input size and the model’s internal processing still scale with the text length.

### Variability

The results can vary slightly between runs because the model is probabilistic, even with the same system and user instructions. To make the output more stable, I would tighten the instruction format (for example: exactly three bullets, one sentence each, no title, no extra commentary) and reduce temperature to a low value such as 0.1–0.2.

### Trade-offs

The chosen model is sufficient for this task because the workload is modest: a few dozen prompts per run, short to medium text, and a constrained structured output. If the task had to process 10,000 texts a day, I would add batching, caching, observability, and possibly a cheaper model for simple cases or a dedicated queue for asynchronous processing.

### Optional model comparison

For the same task, a smaller and faster model often reduces cost and latency while maintaining acceptable quality for summarization and classification. A larger model only pays off when the task is more nuanced or when output quality and consistency are critical. In a production system, a hybrid plan is usually best: use the faster model by default and escalate to the larger one only for uncertain or high-risk cases.
