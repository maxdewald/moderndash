---
"moderndash": patch
---

Fix `deburr` to handle ligatures and special Latin characters (æ, œ, ß, ø, ð, þ, ł, etc.) that don't decompose via Unicode NFD normalization. Previously these characters were silently passed through unchanged. Also improves performance (~2.4x faster than lodash).
