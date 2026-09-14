(() => {
  "use strict";
  function fail(code, message) { const e = new Error(message || code); e.code = code; throw e; }
  function ascii(value, name, { required=false, max=4096 }={}) {
    const text = String(value ?? "").trim();
    if (!text) { if (required) fail(`MISSING_${name.toUpperCase()}`, `${name} не сохранён.`); return ""; }
    if (text.length > max) fail(`INVALID_${name.toUpperCase()}`, `${name} слишком длинный.`);
    for (let i=0;i<text.length;i+=1) { const c=text.charCodeAt(i); if (c<0x21 || c>0x7e) fail(`INVALID_${name.toUpperCase()}`, `${name} содержит недопустимый символ.`); }
    return text;
  }
  function normalizeSellerCredentials(input={}, {required=false}={}) {
    const token = ascii(input.token ?? input.clientId, "token", {required, max:8192});
    const tokenTypeRaw = String(input.tokenType || "personal").trim().toLowerCase();
    if (tokenTypeRaw && tokenTypeRaw !== "personal") {
      fail("UNSUPPORTED_TOKEN_TYPE", "Эта сборка Wildberries Bridge работает только с Personal token.");
    }
    const clientSecret = ascii(input.clientSecret ?? input.apiKey, "client_secret", {required:false, max:4096});
    if (clientSecret) {
      fail("CLIENT_SECRET_UNSUPPORTED_PERSONAL_BUILD", "X-Client-Secret не используется в Personal-token сборке Wildberries Bridge.");
    }
    return Object.freeze({ token, tokenType:"personal", clientSecret:"", clientId:token, apiKey:"", present:Boolean(token) });
  }
  function sellerHeaders(credentials, {hasBody=false, accept="application/json"}={}) {
    const c=normalizeSellerCredentials(credentials,{required:true});
    const h={ Authorization:`Bearer ${c.token}`, Accept:String(accept||"application/json") };
    if (hasBody) h["Content-Type"]="application/json";
    return Object.freeze(h);
  }
  function publicCredentialState(credentials) {
    const c=normalizeSellerCredentials(credentials,{required:false});
    return Object.freeze({
      seller_token_present:Boolean(c.token),
      seller_token_type:"personal",
      seller_client_secret_present:false,
      seller_credentials_present:c.present
    });
  }
  globalThis.WBCredentials=Object.freeze({normalizeSellerCredentials,sellerHeaders,publicCredentialState});
})();
