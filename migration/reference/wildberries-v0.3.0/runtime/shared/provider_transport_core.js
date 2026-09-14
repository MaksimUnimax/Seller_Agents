(() => {
  "use strict";
  function fail(code, message) {
    const error = new Error(message);
    error.code = code;
    throw error;
  }

  function headerValue(headers, name) {
    if (!headers) return null;
    if (typeof headers.get === "function") return headers.get(name);
    const target = String(name).toLowerCase();
    for (const [key, value] of Object.entries(headers)) {
      if (String(key).toLowerCase() === target) return String(value);
    }
    return null;
  }

  function safeResponseMeta(response) {
    return Object.freeze({
      content_type: headerValue(response?.headers, "content-type"),
      content_length: headerValue(response?.headers, "content-length"),
      request_id: headerValue(response?.headers, "x-request-id") || headerValue(response?.headers, "request-id"),
      retry_after: headerValue(response?.headers, "retry-after")
    });
  }

  function abortable(promise, signal, cancel = null) {
    if (!signal) return promise;
    return new Promise((resolve, reject) => {
      const abort = () => {
        reject(Object.assign(new Error('Provider response deadline exceeded.'), {code:'REQUEST_TIMEOUT'}));
        try { Promise.resolve(cancel?.()).catch(() => {}); } catch (_) {}
      };
      if (signal.aborted) { abort(); return; }
      signal.addEventListener('abort', abort, {once:true});
      Promise.resolve(promise).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
    });
  }

  async function readResponseBounded(response, maxBytes = 1_500_000, signal = null) {
    if (!response) fail("EMPTY_RESPONSE", "Provider response отсутствует.");
    const limit = Number(maxBytes);
    if (!Number.isInteger(limit) || limit < 1) fail("INVALID_MAX_RESPONSE_BYTES", "maxBytes должен быть положительным целым числом.");
    const decoder = new TextDecoder();
    if (response.body && typeof response.body.getReader === "function") {
      const reader = response.body.getReader();
      const chunks = [];
      let total = 0;
      for (;;) {
        const { done, value } = await abortable(reader.read(), signal, () => reader.cancel());
        if (done) break;
        const bytes = value instanceof Uint8Array ? value : new Uint8Array(value || []);
        total += bytes.byteLength;
        if (total > limit) {
          try { await reader.cancel(); } catch (_) {}
          fail("RESPONSE_TOO_LARGE", `Provider response превышает ${limit} bytes.`);
        }
        chunks.push(bytes);
      }
      const merged = new Uint8Array(total);
      let offset = 0;
      for (const chunk of chunks) {
        merged.set(chunk, offset);
        offset += chunk.byteLength;
      }
      return Object.freeze({ rawText: decoder.decode(merged), byteLength: total });
    }
    const rawText = typeof response.text === "function" ? await abortable(response.text(), signal) : String(response.body ?? "");
    const byteLength = new TextEncoder().encode(rawText).byteLength;
    if (byteLength > limit) fail("RESPONSE_TOO_LARGE", `Provider response превышает ${limit} bytes.`);
    return Object.freeze({ rawText, byteLength });
  }

  async function executeJsonOnce({ fetchImpl, request, timeoutMs = 30_000, maxBytes = 1_500_000, now = () => Date.now() }) {
    if (typeof fetchImpl !== "function") fail("FETCH_IMPL_MISSING", "fetchImpl обязателен.");
    if (!request || typeof request !== "object") fail("INVALID_REQUEST", "Trusted request object обязателен.");
    const allowedHosts = new Set(["content-api.wildberries.ru","discounts-prices-api.wildberries.ru","marketplace-api.wildberries.ru","seller-analytics-api.wildberries.ru","statistics-api.wildberries.ru","finance-api.wildberries.ru","documents-api.wildberries.ru","common-api.wildberries.ru","supplies-api.wildberries.ru","advert-api.wildberries.ru","advert-media-api.wildberries.ru","dp-calendar-api.wildberries.ru","feedbacks-api.wildberries.ru","returns-api.wildberries.ru"]);
    let trustedUrl; try { trustedUrl = new URL(String(request.url || "")); } catch (_) { fail("UNTRUSTED_REQUEST_HOST", "Некорректный provider URL."); }
    if (trustedUrl.protocol !== "https:" || !allowedHosts.has(trustedUrl.hostname) || trustedUrl.username || trustedUrl.password || trustedUrl.port) fail("UNTRUSTED_REQUEST_HOST", "Разрешены только fixed official Wildberries API hosts.");
    if (!/^(GET|POST)$/.test(String(request.method || ""))) fail("UNTRUSTED_REQUEST_METHOD", "Разрешены только заранее зафиксированные GET/POST read methods.");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.max(1, Number(timeoutMs) || 30_000));
    const started = now();
    let response;
    try {
      response = await fetchImpl(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.method === "GET" ? undefined : request.body,
        redirect: "error",
        signal: controller.signal
      });
    } catch (error) {
      clearTimeout(timer);
      if (error?.name === "AbortError" || controller.signal.aborted) fail("REQUEST_TIMEOUT", "Wildberries API request timeout.");
      const wrapped = new Error(String(error?.message || error || "Provider fetch failed"));
      wrapped.code = "PROVIDER_FETCH_FAILED";
      throw wrapped;
    }

    let bounded;
    try { bounded = await readResponseBounded(response, maxBytes, controller.signal); }
    finally { clearTimeout(timer); }
    let parsed = null;
    if (bounded.rawText.trim()) {
      try { parsed = JSON.parse(bounded.rawText); }
      catch (_) { parsed = null; }
    }
    return Object.freeze({
      httpStatus: Number(response.status || 0),
      ok: Boolean(response.ok),
      rawText: bounded.rawText,
      parsed,
      byteLength: bounded.byteLength,
      elapsedMs: Math.max(0, Number(now() - started) || 0),
      responseMeta: safeResponseMeta(response)
    });
  }

  async function readBinaryBounded(response, maxBytes = 8_000_000, signal = null) {
    if (!response) fail("EMPTY_RESPONSE", "Provider response отсутствует.");
    const limit = Number(maxBytes);
    if (!Number.isInteger(limit) || limit < 1) fail("INVALID_MAX_RESPONSE_BYTES", "maxBytes должен быть положительным целым числом.");
    let bytes;
    if (response.body && typeof response.body.getReader === "function") {
      const reader=response.body.getReader(), chunks=[]; let total=0;
      for (;;) { const {done,value}=await abortable(reader.read(),signal,()=>reader.cancel()); if(done) break; const b=value instanceof Uint8Array?value:new Uint8Array(value||[]); total+=b.byteLength; if(total>limit){try{await reader.cancel();}catch(_){} fail("RESPONSE_TOO_LARGE", `Provider response превышает ${limit} bytes.`);} chunks.push(b);}
      bytes=new Uint8Array(total); let off=0; for(const b of chunks){bytes.set(b,off);off+=b.byteLength;}
    } else { const ab=typeof response.arrayBuffer==="function"?await abortable(response.arrayBuffer(),signal):new TextEncoder().encode(String(response.body??"")).buffer; bytes=new Uint8Array(ab); if(bytes.byteLength>limit) fail("RESPONSE_TOO_LARGE", `Provider response превышает ${limit} bytes.`); }
    return Object.freeze({bytes, byteLength:bytes.byteLength});
  }
  async function executeBinaryOnce({ fetchImpl, request, timeoutMs=30_000, maxBytes=8_000_000, now=()=>Date.now() }) {
    if (typeof fetchImpl !== "function") fail("FETCH_IMPL_MISSING", "fetchImpl обязателен.");
    if (!request || typeof request !== "object") fail("INVALID_REQUEST", "Trusted request object обязателен.");
    const allowedHosts = new Set(["content-api.wildberries.ru","discounts-prices-api.wildberries.ru","marketplace-api.wildberries.ru","seller-analytics-api.wildberries.ru","statistics-api.wildberries.ru","finance-api.wildberries.ru","documents-api.wildberries.ru","common-api.wildberries.ru","supplies-api.wildberries.ru","advert-api.wildberries.ru","advert-media-api.wildberries.ru","dp-calendar-api.wildberries.ru","feedbacks-api.wildberries.ru","returns-api.wildberries.ru"]);
    let trustedUrl; try { trustedUrl=new URL(String(request.url||"")); } catch(_){ fail("UNTRUSTED_REQUEST_HOST","Некорректный provider URL."); }
    if(trustedUrl.protocol!=="https:"||!allowedHosts.has(trustedUrl.hostname)||trustedUrl.username||trustedUrl.password||trustedUrl.port) fail("UNTRUSTED_REQUEST_HOST","Разрешены только fixed official Wildberries API hosts.");
    if(!/^(GET|POST)$/.test(String(request.method||""))) fail("UNTRUSTED_REQUEST_METHOD","Разрешены только заранее зафиксированные GET/POST read methods.");
    const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),Math.max(1,Number(timeoutMs)||30_000)); const started=now(); let response;
    try{response=await fetchImpl(request.url,{method:request.method,headers:request.headers,body:request.method==="GET"?undefined:request.body,redirect:"error",signal:controller.signal});}
    catch(error){clearTimeout(timer);if(error?.name==="AbortError"||controller.signal.aborted) fail("REQUEST_TIMEOUT","Wildberries API request timeout."); const e=new Error(String(error?.message||error||"Provider fetch failed"));e.code="PROVIDER_FETCH_FAILED";throw e;}
    let bounded;try{bounded=await readBinaryBounded(response,maxBytes,controller.signal);}finally{clearTimeout(timer);}
    let binaryBase64=""; if (bounded.bytes.byteLength) { let s=""; for(let i=0;i<bounded.bytes.length;i+=0x8000) s+=String.fromCharCode(...bounded.bytes.subarray(i,i+0x8000)); binaryBase64=btoa(s); }
    return Object.freeze({httpStatus:Number(response.status||0),ok:Boolean(response.ok),binaryBase64,byteLength:bounded.byteLength,elapsedMs:Math.max(0,Number(now()-started)||0),responseMeta:safeResponseMeta(response)});
  }

  globalThis.ProviderTransportCore = Object.freeze({ readResponseBounded, readBinaryBounded, executeJsonOnce, executeBinaryOnce });
})();
