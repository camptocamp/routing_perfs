# k6

## Running the test outside compose

### NexSIS

**_Pré-requis : avoir activé le VPN_**

```bash
docker run --rm --network host -v ${PWD}/scripts:/scripts loadimpact/k6:0.29.0 run --insecure-skip-tls-verify /scripts/nexsis/smoke.js
```
