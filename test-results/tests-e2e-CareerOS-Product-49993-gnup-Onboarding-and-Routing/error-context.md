# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e.spec.js >> CareerOS Production E2E Tests >> User 1: Signup, Onboarding, and Routing
- Location: tests\e2e.spec.js:13:3

# Error details

```
Error: apiRequestContext.get: Max redirect count exceeded
Call log:
  - → GET https://careeros-iota.vercel.app/dashboard/performance
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..nWhSSmU0yLhGNoS6FD2k-A.Ejq_-ndxk-vGYNkf2JItdaG67A1fW9VnnQw2tpCtCMqeHg2uXu7PcHzHTMb8-ydsI8oS_h6GB3ITcm_a9-02PuxatAUR68GDkQ1vSIOMdr3p1OiForwTrVMULgi6fE2HUe-3uKa_w19JDIo8vNIpTM2rTrZbB0zJ_6qdRSNBg5cETW1j2mY5727eBIRiPWfXfxXS3GX2P277HIkYqmZAz_v2SdxrSX5lqA0wNFExHe__Ln-t6noIIlCCsj3m5uEHPxUfL3bvBOwDa0_L8cymUuRXIgIPVeF52IFSqVu0cpBcCBdSQgSrH0XJBA0Yzahr7JCDgHauuffLRt8wLvSV7A.cdiErC2-l0bsA5O2eRAmowBANKxf5zU0Iz95pZW1Emk
  - ← 302 Found
    - cache-control: public, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/plain
    - date: Sun, 12 Jul 2026 09:45:04 GMT
    - location: /onboarding
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..ZQcxet7Q8CKrkZjl6JX1wA.7O2md2YOPj4csKPDcfgo-RBylGCGcUtTx-1k0PK2bg-R9HVIiYzfBMlxYDsGU7y_wnPKSRG5APQGH3UNRSdjBpb8XkNLQSthwCUE72p0YFd30z6Ps9qshcGsDOiHozMD2aeeZsD-vNVqwSXipHaEWIzBdu7POJo2mJflcqPp55VUW5Ecy6ymBk_M7uAa2YEQv3EiV5mZrdEKzVDaMjBVG0MjrRV2bUf_eeitm4SfhikGbmSyKxz-5RpkKhWtxkh-PG-6nLGrA1n73AXs3PcsW_C-4UZP_4Q7m7VPwtT_XSI8eoH3KJiFASY05MKdOE3pKEaYMGAzG1NSqjvruutedg.ESM5dfQRsqZjhG4oKYEsbu76fMtfjvX-MnSHVudlm-M; Path=/; Expires=Tue, 11 Aug 2026 09:45:04 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-vercel-id: bom1::rdcm2-1783849504362-2ea949d92b61
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/onboarding
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..ZQcxet7Q8CKrkZjl6JX1wA.7O2md2YOPj4csKPDcfgo-RBylGCGcUtTx-1k0PK2bg-R9HVIiYzfBMlxYDsGU7y_wnPKSRG5APQGH3UNRSdjBpb8XkNLQSthwCUE72p0YFd30z6Ps9qshcGsDOiHozMD2aeeZsD-vNVqwSXipHaEWIzBdu7POJo2mJflcqPp55VUW5Ecy6ymBk_M7uAa2YEQv3EiV5mZrdEKzVDaMjBVG0MjrRV2bUf_eeitm4SfhikGbmSyKxz-5RpkKhWtxkh-PG-6nLGrA1n73AXs3PcsW_C-4UZP_4Q7m7VPwtT_XSI8eoH3KJiFASY05MKdOE3pKEaYMGAzG1NSqjvruutedg.ESM5dfQRsqZjhG4oKYEsbu76fMtfjvX-MnSHVudlm-M
  - ← 307 Temporary Redirect
    - age: 0
    - cache-control: private, no-cache, no-store, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/html; charset=utf-8
    - date: Sun, 12 Jul 2026 09:45:04 GMT
    - link: </_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/chunks/233p45nuh4m5b.css>; rel=preload; as="style", </_next/static/chunks/0h2awhdfsm86k.css>; rel=preload; as="style"
    - location: /dashboard
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..2nn8iw7yXWQGh3j5dkOVtg.ysRbpaF0Gmq6fZLYsMYHN8OpA45A4pd9uNaRCy6HsqYeDHLwJyw2Ke9rHgUbyn2snHCYTHiqWi7GZg-w0ia0Cfjmr9p6IYAteNKATVjEsNAK6UD4bYHoF8etkRNXSfqxWJW6m4uhiY8Cv8XYn8032GGQuNMCMADWntC3h2uVxDd390j_kwz2CDh1VBBAHL1qsGlnNibGIhl0ciZl_xVF05EkJAEqsx2RzymyONgq2POSHSHAPFFvfDypHHG0Y2uj50sKhHnTArLDV0inK80TIz3s6zrwe0yPQajAeg53T_MALu42eYlKM2Ptwb3fcPNs9sn3aY2ISqHaf5SJsg9mDQ.Lmg5hrL4PQMrCIi4CE8EIGo-6XLlFemjyv2vhNSePlE; Path=/; Expires=Tue, 11 Aug 2026 09:45:04 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-matched-path: /onboarding
    - x-powered-by: Next.js
    - x-vercel-cache: MISS
    - x-vercel-id: bom1::iad1::2m5zw-1783849504688-5938be620581
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/dashboard
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..2nn8iw7yXWQGh3j5dkOVtg.ysRbpaF0Gmq6fZLYsMYHN8OpA45A4pd9uNaRCy6HsqYeDHLwJyw2Ke9rHgUbyn2snHCYTHiqWi7GZg-w0ia0Cfjmr9p6IYAteNKATVjEsNAK6UD4bYHoF8etkRNXSfqxWJW6m4uhiY8Cv8XYn8032GGQuNMCMADWntC3h2uVxDd390j_kwz2CDh1VBBAHL1qsGlnNibGIhl0ciZl_xVF05EkJAEqsx2RzymyONgq2POSHSHAPFFvfDypHHG0Y2uj50sKhHnTArLDV0inK80TIz3s6zrwe0yPQajAeg53T_MALu42eYlKM2Ptwb3fcPNs9sn3aY2ISqHaf5SJsg9mDQ.Lmg5hrL4PQMrCIi4CE8EIGo-6XLlFemjyv2vhNSePlE
  - ← 302 Found
    - cache-control: public, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/plain
    - date: Sun, 12 Jul 2026 09:45:05 GMT
    - location: /onboarding
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..dWDdLKS7F7RuewlCMec5PQ.DH1-VLPCiK1StzBlVzLJa-lMrXHUYeP33YJ6zhF1mkkR7gX9CSivcX-LJ0Y4Gugpwb393P0x9LjQWYEAGmgfHFUVD35pfH4DGL7VtU0pmIjjqixAoMBn7aHuM06IaZ12jBk6J6XG35fJGDBaTaowFA-pEpyQdp8-0HdHeI6_1TTEbfWXFV2KQzDBM7zFYtEr2cXUDEMyBZoT9zAQEcDT9HpcMy9zo09IxvdqOhztiH08Zgoa8ZGTGGjgReQThnqwMSfabaSjLm284iICn0voEyk7otCzywVh_DyRLh4BafSebWMPpLM4B8y7nSfOmESASQZOjnsEIktLz34zel_fmg.cc9w-SfG3Wgq1BtonYPb-QPGhnJwOqYpMyzKr59GnRM; Path=/; Expires=Tue, 11 Aug 2026 09:45:05 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-vercel-id: bom1::t5rzf-1783849505433-1833da20889f
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/onboarding
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..dWDdLKS7F7RuewlCMec5PQ.DH1-VLPCiK1StzBlVzLJa-lMrXHUYeP33YJ6zhF1mkkR7gX9CSivcX-LJ0Y4Gugpwb393P0x9LjQWYEAGmgfHFUVD35pfH4DGL7VtU0pmIjjqixAoMBn7aHuM06IaZ12jBk6J6XG35fJGDBaTaowFA-pEpyQdp8-0HdHeI6_1TTEbfWXFV2KQzDBM7zFYtEr2cXUDEMyBZoT9zAQEcDT9HpcMy9zo09IxvdqOhztiH08Zgoa8ZGTGGjgReQThnqwMSfabaSjLm284iICn0voEyk7otCzywVh_DyRLh4BafSebWMPpLM4B8y7nSfOmESASQZOjnsEIktLz34zel_fmg.cc9w-SfG3Wgq1BtonYPb-QPGhnJwOqYpMyzKr59GnRM
  - ← 307 Temporary Redirect
    - age: 0
    - cache-control: private, no-cache, no-store, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/html; charset=utf-8
    - date: Sun, 12 Jul 2026 09:45:06 GMT
    - link: </_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/chunks/233p45nuh4m5b.css>; rel=preload; as="style", </_next/static/chunks/0h2awhdfsm86k.css>; rel=preload; as="style"
    - location: /dashboard
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..9N4zriCp_VJoq-T4vhlbAg.vvSIIY6D_3SWbu6n-fDlTbV48WO4jP9alHPpaIfSYUxlHf_22B1fl8-lPBFGZT_kUpWTBx8FmYdkwpGAsIsatHoJ7MwTlYlePO0sWfYCnRukoL2wVXYJnTYxG2kns3Rob2zBu4bGjqYLJLxJEyJnqYCuXNVoSzMZ1LP-ywCCIHxNqoOF7X0NZAP-r1s3JECcTWq7wChQgKhb6fd2kCcGNnNvmqBkQD1NhbKKFB7K5-z1_6A3njbIj6OraqvG1nfjEZfOvkeW3UaDAq0MjBhqU3vYoDYbynzgdAznxlnaMwL_AMPLiNjJXSk0CTlpMza3d4kHi_3hHN2oPEDJlulTug.vCqCjRc1YLh5yybVWQcFQ3uqfgWXKmHKUpY7vBUNH4o; Path=/; Expires=Tue, 11 Aug 2026 09:45:05 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-matched-path: /onboarding
    - x-powered-by: Next.js
    - x-vercel-cache: MISS
    - x-vercel-id: bom1::iad1::p7qb8-1783849505929-76abf1519d0e
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/dashboard
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..9N4zriCp_VJoq-T4vhlbAg.vvSIIY6D_3SWbu6n-fDlTbV48WO4jP9alHPpaIfSYUxlHf_22B1fl8-lPBFGZT_kUpWTBx8FmYdkwpGAsIsatHoJ7MwTlYlePO0sWfYCnRukoL2wVXYJnTYxG2kns3Rob2zBu4bGjqYLJLxJEyJnqYCuXNVoSzMZ1LP-ywCCIHxNqoOF7X0NZAP-r1s3JECcTWq7wChQgKhb6fd2kCcGNnNvmqBkQD1NhbKKFB7K5-z1_6A3njbIj6OraqvG1nfjEZfOvkeW3UaDAq0MjBhqU3vYoDYbynzgdAznxlnaMwL_AMPLiNjJXSk0CTlpMza3d4kHi_3hHN2oPEDJlulTug.vCqCjRc1YLh5yybVWQcFQ3uqfgWXKmHKUpY7vBUNH4o
  - ← 302 Found
    - cache-control: public, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/plain
    - date: Sun, 12 Jul 2026 09:45:06 GMT
    - location: /onboarding
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..yqXBMQwD_wfQSFuqof2fvQ.vqGL3XDg5T19BvH7W5ZiftPrwWRNuUJnt5W-jNisyZeW9kn4YZQOzQiAR3kWITgl3VCr_f6U4ztkqK8OG8pfClRE44hgBJanp9B3FTSjUcWrcvr7SuU8yVSY1HlM5Y3Yb7Rs5RsHthmnqvkVEUyp_xxvIkFoe0hq7ci_bMfmDq4tBTrbS3P_vDnzUSvRGEYENJ7qP4C-yabuzLF-tn0sdfsjM3PtIuuLf9y5qNamlV1g8TGcQDqpH2fEfedtuwjAxWwnVEnItDFPTOS3IJa_7pmED9H7HFHNeIXQ2JIZh8DCAyAeSj2wZbgpCFwGMQRrZpjuQNVbzKRIq2BA9Jyewg.-ZpAiK_s53g_E_0Ht6DaHAwaOrA5aCwet51Mys567TA; Path=/; Expires=Tue, 11 Aug 2026 09:45:06 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-vercel-id: bom1::zxpj8-1783849506649-8204dac99911
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/onboarding
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..yqXBMQwD_wfQSFuqof2fvQ.vqGL3XDg5T19BvH7W5ZiftPrwWRNuUJnt5W-jNisyZeW9kn4YZQOzQiAR3kWITgl3VCr_f6U4ztkqK8OG8pfClRE44hgBJanp9B3FTSjUcWrcvr7SuU8yVSY1HlM5Y3Yb7Rs5RsHthmnqvkVEUyp_xxvIkFoe0hq7ci_bMfmDq4tBTrbS3P_vDnzUSvRGEYENJ7qP4C-yabuzLF-tn0sdfsjM3PtIuuLf9y5qNamlV1g8TGcQDqpH2fEfedtuwjAxWwnVEnItDFPTOS3IJa_7pmED9H7HFHNeIXQ2JIZh8DCAyAeSj2wZbgpCFwGMQRrZpjuQNVbzKRIq2BA9Jyewg.-ZpAiK_s53g_E_0Ht6DaHAwaOrA5aCwet51Mys567TA
  - ← 307 Temporary Redirect
    - age: 0
    - cache-control: private, no-cache, no-store, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/html; charset=utf-8
    - date: Sun, 12 Jul 2026 09:45:07 GMT
    - link: </_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/chunks/233p45nuh4m5b.css>; rel=preload; as="style", </_next/static/chunks/0h2awhdfsm86k.css>; rel=preload; as="style"
    - location: /dashboard
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..CyGjcDOQTCsyop75q4f1Mg.8vEecxOw2yoosvUHDR44pmP4cMytrEPn7Ixr61IwDAuUvpShnXq1-Q1X0B3qC5CqmtvsFhAmVQcsPIZs5rqJbwSvgUaCIxLMaBnyfT6MxBcjZJoD1x3JHdwUSy5S-eX1LjOO4qsdP8Y_0rpZAUL14eRE4X52fCMyg-XRT2DAjzIYcZMhLwd-7LdeE4ao8rNEUYwfqmH18W2d4uRW7eilrOLW_oP9d_6w3E3zT63TUDUhOyixyIFVy_Prd3GeVYTugFVoQVHa3i4N8QLLmUliyUkiAXGiRP_bJFXJqKJZvu903YRntXyTUci7cjcCLRFTZr_M35JIbskvP_5MaRF2Ig.Jf-Hlj8Sk6TPjnplxO0RJdM6ivx0v-u0WDLfKZ9vfrY; Path=/; Expires=Tue, 11 Aug 2026 09:45:07 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-matched-path: /onboarding
    - x-powered-by: Next.js
    - x-vercel-cache: MISS
    - x-vercel-id: bom1::iad1::7nkwr-1783849507503-584caa36944f
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/dashboard
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..CyGjcDOQTCsyop75q4f1Mg.8vEecxOw2yoosvUHDR44pmP4cMytrEPn7Ixr61IwDAuUvpShnXq1-Q1X0B3qC5CqmtvsFhAmVQcsPIZs5rqJbwSvgUaCIxLMaBnyfT6MxBcjZJoD1x3JHdwUSy5S-eX1LjOO4qsdP8Y_0rpZAUL14eRE4X52fCMyg-XRT2DAjzIYcZMhLwd-7LdeE4ao8rNEUYwfqmH18W2d4uRW7eilrOLW_oP9d_6w3E3zT63TUDUhOyixyIFVy_Prd3GeVYTugFVoQVHa3i4N8QLLmUliyUkiAXGiRP_bJFXJqKJZvu903YRntXyTUci7cjcCLRFTZr_M35JIbskvP_5MaRF2Ig.Jf-Hlj8Sk6TPjnplxO0RJdM6ivx0v-u0WDLfKZ9vfrY
  - ← 302 Found
    - cache-control: public, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/plain
    - date: Sun, 12 Jul 2026 09:45:08 GMT
    - location: /onboarding
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..sH-aNFNYL4l10R0HC7E-Yg.Gm4YVUR41Wk24YyH1rmGVvOvw_AQWLPzm1KRNTA5rpcmnrE34ejbNxAVLSyUj7snSxj7mqpXcVTU4Pqw-0CHViV4Ud1OkT7m96S_v18SLUoPpEK9t8yT9scFUjve7Ph0v_FVuCug8OiBtE-WTHqY0z4mpppg4p3yg2wF93BJL1H97Vi1S7phPAPal3c9fdFMxu5yvsF-NmEFPyb2DhlCBHcZsYJJNL7DMDIVgOM8ytjcYmoGs7jqRzTBEmKILA8oS_Qk-ZHOo-kOd8preWnPScwX-UDaiGo6CvzuvfwZoRjcCJrE_8rW1whBcP7hkzwPIUrCC6TBHT56bZs4YCU5ug.K2hsirC_G3EQaPRogFZiJHRbOdI_D2_-27NmAkTkpRU; Path=/; Expires=Tue, 11 Aug 2026 09:45:08 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-vercel-id: bom1::g4zsm-1783849508138-17a1d3b1c735
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/onboarding
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..sH-aNFNYL4l10R0HC7E-Yg.Gm4YVUR41Wk24YyH1rmGVvOvw_AQWLPzm1KRNTA5rpcmnrE34ejbNxAVLSyUj7snSxj7mqpXcVTU4Pqw-0CHViV4Ud1OkT7m96S_v18SLUoPpEK9t8yT9scFUjve7Ph0v_FVuCug8OiBtE-WTHqY0z4mpppg4p3yg2wF93BJL1H97Vi1S7phPAPal3c9fdFMxu5yvsF-NmEFPyb2DhlCBHcZsYJJNL7DMDIVgOM8ytjcYmoGs7jqRzTBEmKILA8oS_Qk-ZHOo-kOd8preWnPScwX-UDaiGo6CvzuvfwZoRjcCJrE_8rW1whBcP7hkzwPIUrCC6TBHT56bZs4YCU5ug.K2hsirC_G3EQaPRogFZiJHRbOdI_D2_-27NmAkTkpRU
  - ← 307 Temporary Redirect
    - age: 0
    - cache-control: private, no-cache, no-store, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/html; charset=utf-8
    - date: Sun, 12 Jul 2026 09:45:08 GMT
    - link: </_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/chunks/233p45nuh4m5b.css>; rel=preload; as="style", </_next/static/chunks/0h2awhdfsm86k.css>; rel=preload; as="style"
    - location: /dashboard
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..mny_35sVqd8gSAGTwXv7rA.Jy23rDVreAvUvohR20xBXsxV-SOQsZQ7Skjz1GUhO6p-F00hTsvx4cpiYEACrK5De_dB0kOlzT_5GTC7ZvcQzBXjBCe6ZN3x6EEUyp7XTIgytKctq_kWeeFYx15OmjpEXNGWJYxp_bU5V-_dG4_xao_QeO2MwoFdkEbYHB3-QHYuR2_TzLG7fXkzYCOqGcB_KjeEFuGfHBUKhV0_x4p44taqiZ0R3X1r40xEjR33DO_xWY6tsGi4vqgoD3pQltdShJYbm5FnhYcZXUZZVjMq1lz4Do6FrRUCz7kmQwlJwx-gJnMxqPIYkv6-Ff9hvQL-qAbgFnmr3xcmXClhryqVNw.VLZihSBT8S0IjfOP6Rwb1A0-PxxSovJPTVApJaU9Vfk; Path=/; Expires=Tue, 11 Aug 2026 09:45:08 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-matched-path: /onboarding
    - x-powered-by: Next.js
    - x-vercel-cache: MISS
    - x-vercel-id: bom1::iad1::9nlbw-1783849508592-e74f8eb6235d
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/dashboard
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..mny_35sVqd8gSAGTwXv7rA.Jy23rDVreAvUvohR20xBXsxV-SOQsZQ7Skjz1GUhO6p-F00hTsvx4cpiYEACrK5De_dB0kOlzT_5GTC7ZvcQzBXjBCe6ZN3x6EEUyp7XTIgytKctq_kWeeFYx15OmjpEXNGWJYxp_bU5V-_dG4_xao_QeO2MwoFdkEbYHB3-QHYuR2_TzLG7fXkzYCOqGcB_KjeEFuGfHBUKhV0_x4p44taqiZ0R3X1r40xEjR33DO_xWY6tsGi4vqgoD3pQltdShJYbm5FnhYcZXUZZVjMq1lz4Do6FrRUCz7kmQwlJwx-gJnMxqPIYkv6-Ff9hvQL-qAbgFnmr3xcmXClhryqVNw.VLZihSBT8S0IjfOP6Rwb1A0-PxxSovJPTVApJaU9Vfk
  - ← 302 Found
    - cache-control: public, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/plain
    - date: Sun, 12 Jul 2026 09:45:09 GMT
    - location: /onboarding
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..-8BsNdJ_wsohf8lJ52u0cA._9P1AlsaMYXugKKS7aM_60TAcj0j_pkW2_zve_Rssn7dMuBekTKKcDi4NwLJIYeuT0uxnbjq6cifiBGr2svxZriu_7dbuvviB2GwtSje_W0PuIWnBAiTQXOz-0h_w82Kw8CNQ6KLJABfCn2xQ4ZTHALczFk_HKfikki6ppG1IzJY3DYm_Tjg2VJAJb7hyh15mXgI6tha7OPEv49ux6fgt6nKbpTnhAu-OL-TVWfrgMH7AfBXgfcI4yqXABbswngNDtlomVK1me6jVvcfHmEqygMQZkCxhSbB69gpaRxK-kYa0TXPkRc1wxSmM_-8c_8JkdZSbV2YuroYnr79NISyqA.kb2lMX3nt7fBmvJqpgVK93QekqNF1z9lKaBzAGU8oBU; Path=/; Expires=Tue, 11 Aug 2026 09:45:09 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-vercel-id: bom1::596wt-1783849509005-466515b9d6f7
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/onboarding
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..-8BsNdJ_wsohf8lJ52u0cA._9P1AlsaMYXugKKS7aM_60TAcj0j_pkW2_zve_Rssn7dMuBekTKKcDi4NwLJIYeuT0uxnbjq6cifiBGr2svxZriu_7dbuvviB2GwtSje_W0PuIWnBAiTQXOz-0h_w82Kw8CNQ6KLJABfCn2xQ4ZTHALczFk_HKfikki6ppG1IzJY3DYm_Tjg2VJAJb7hyh15mXgI6tha7OPEv49ux6fgt6nKbpTnhAu-OL-TVWfrgMH7AfBXgfcI4yqXABbswngNDtlomVK1me6jVvcfHmEqygMQZkCxhSbB69gpaRxK-kYa0TXPkRc1wxSmM_-8c_8JkdZSbV2YuroYnr79NISyqA.kb2lMX3nt7fBmvJqpgVK93QekqNF1z9lKaBzAGU8oBU
  - ← 307 Temporary Redirect
    - age: 0
    - cache-control: private, no-cache, no-store, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/html; charset=utf-8
    - date: Sun, 12 Jul 2026 09:45:09 GMT
    - link: </_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/chunks/233p45nuh4m5b.css>; rel=preload; as="style", </_next/static/chunks/0h2awhdfsm86k.css>; rel=preload; as="style"
    - location: /dashboard
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..x8RMNPnvuWjoa_o_-_I4cw.es1cHJlbkF9tGVGcwb2S9Ry3sNby7npjxmZyek4eaegDigcE8TktItZngJx60OQRS5ZEmmCoIzWwyjlkFeoJLlb3n_tKIj8UhYAYHSLItXwl0vvbeftEE-XpaoTuFDDCRO0Ii4FddAmD9YFXqNvpq54EnNCQ8Xs9IxDkfMXQQhYa9z-FPsK-VxUqLC4FnvhZo-mI43YqEThYrHpM-V8_zyoUebpitvOQyBsHdf97A6_9Pr0aLtFajS9XNKudFQZtqMbOoHBiqYMEtDFl0dmpSGZF5XCUum1UGJLo1bfDHC6P7Z0dhCYlLAVULkHgEUe7I1p4DHNEwWEEZYVTeDB2dQ.LMowfyOLe2X9zx3AnMxd7nuU2CjhL0KPicTqKTxDYsI; Path=/; Expires=Tue, 11 Aug 2026 09:45:09 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-matched-path: /onboarding
    - x-powered-by: Next.js
    - x-vercel-cache: MISS
    - x-vercel-id: bom1::iad1::4f8pp-1783849509310-00cfe55805cf
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/dashboard
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..x8RMNPnvuWjoa_o_-_I4cw.es1cHJlbkF9tGVGcwb2S9Ry3sNby7npjxmZyek4eaegDigcE8TktItZngJx60OQRS5ZEmmCoIzWwyjlkFeoJLlb3n_tKIj8UhYAYHSLItXwl0vvbeftEE-XpaoTuFDDCRO0Ii4FddAmD9YFXqNvpq54EnNCQ8Xs9IxDkfMXQQhYa9z-FPsK-VxUqLC4FnvhZo-mI43YqEThYrHpM-V8_zyoUebpitvOQyBsHdf97A6_9Pr0aLtFajS9XNKudFQZtqMbOoHBiqYMEtDFl0dmpSGZF5XCUum1UGJLo1bfDHC6P7Z0dhCYlLAVULkHgEUe7I1p4DHNEwWEEZYVTeDB2dQ.LMowfyOLe2X9zx3AnMxd7nuU2CjhL0KPicTqKTxDYsI
  - ← 302 Found
    - cache-control: public, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/plain
    - date: Sun, 12 Jul 2026 09:45:09 GMT
    - location: /onboarding
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..fxl9CZwaQ9OJ3Wl8RKzjxQ.sC1EyMtPZG1bJ_vx-aLSyYb3LaUwQXSaBCkNqrSdB24qIgxKNYawxtPuFny5hZL986p7sz6U0AEOfSLpCWotKdoTa7CsI_jgs5peY6pRniKh0Dv5QRjwfohOxwN4_AqcEAVl21IBTpSkaRaIN0CNM2emEqcJjWlx-lHz59D2sK_iX9n8DRsevvnfzBa0hYWwBJ3z7VFT5FDfzxridTjAKelabRxiFeIC_eHInDXH3EPdruiG1ywMBQ7wmHiT_bZclttqWbvYvbq6T56H5ZrcG-xLa7mVeciAFpExkFQ2_yUTaOzO5SszogtY40yEvtfcOP5Yg8Rx1cdUKn7-6DhOlA.7EdheV9hbpCIA5BQSN8h9jn0757dywqwFvuko6viIbo; Path=/; Expires=Tue, 11 Aug 2026 09:45:09 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-vercel-id: bom1::lkc47-1783849509923-3d9e71ff9f6b
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/onboarding
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..fxl9CZwaQ9OJ3Wl8RKzjxQ.sC1EyMtPZG1bJ_vx-aLSyYb3LaUwQXSaBCkNqrSdB24qIgxKNYawxtPuFny5hZL986p7sz6U0AEOfSLpCWotKdoTa7CsI_jgs5peY6pRniKh0Dv5QRjwfohOxwN4_AqcEAVl21IBTpSkaRaIN0CNM2emEqcJjWlx-lHz59D2sK_iX9n8DRsevvnfzBa0hYWwBJ3z7VFT5FDfzxridTjAKelabRxiFeIC_eHInDXH3EPdruiG1ywMBQ7wmHiT_bZclttqWbvYvbq6T56H5ZrcG-xLa7mVeciAFpExkFQ2_yUTaOzO5SszogtY40yEvtfcOP5Yg8Rx1cdUKn7-6DhOlA.7EdheV9hbpCIA5BQSN8h9jn0757dywqwFvuko6viIbo
  - ← 307 Temporary Redirect
    - age: 0
    - cache-control: private, no-cache, no-store, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/html; charset=utf-8
    - date: Sun, 12 Jul 2026 09:45:10 GMT
    - link: </_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/chunks/233p45nuh4m5b.css>; rel=preload; as="style", </_next/static/chunks/0h2awhdfsm86k.css>; rel=preload; as="style"
    - location: /dashboard
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..sZcyQ6m5RCYr61R4-0J4ow.ESZcRRxn4bSkF5gtVM6D5HfqM7gGJlSEE3U8_3X96L90aUpFsWPZxx0FOAK86TQsYt3jiN72h74TaMAhs-Kr8n5Zp6KSyFjvs05iGwFKNWZUwsuyRxBTKI5Ur-GTVLWGszPvHwSGXPNtB1kzXkuVwu15F7Nry9LVidZ1i2aETx0Ex_aNi5xohq80FYzHkePbNESpgJScOB7Be5PRPJPsrRD4JKZhjiIakjLVSqP9f7yKzrXYjdIGaCqmfyE1re8MyPWHKUbuZpkD9szNEKIsgFmm_aHSKPzCw-qK9ZV-XUbSGK1LGhC3FlLF40EdiKFPV6-xUb-Fn-HCLUm1iUdxqA.5kUVO1XpHWwO68FnXfpkGMZIorqssMD1luNyzA-_mGc; Path=/; Expires=Tue, 11 Aug 2026 09:45:10 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-matched-path: /onboarding
    - x-powered-by: Next.js
    - x-vercel-cache: MISS
    - x-vercel-id: bom1::iad1::2pznv-1783849510229-8ecd403f166a
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/dashboard
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..sZcyQ6m5RCYr61R4-0J4ow.ESZcRRxn4bSkF5gtVM6D5HfqM7gGJlSEE3U8_3X96L90aUpFsWPZxx0FOAK86TQsYt3jiN72h74TaMAhs-Kr8n5Zp6KSyFjvs05iGwFKNWZUwsuyRxBTKI5Ur-GTVLWGszPvHwSGXPNtB1kzXkuVwu15F7Nry9LVidZ1i2aETx0Ex_aNi5xohq80FYzHkePbNESpgJScOB7Be5PRPJPsrRD4JKZhjiIakjLVSqP9f7yKzrXYjdIGaCqmfyE1re8MyPWHKUbuZpkD9szNEKIsgFmm_aHSKPzCw-qK9ZV-XUbSGK1LGhC3FlLF40EdiKFPV6-xUb-Fn-HCLUm1iUdxqA.5kUVO1XpHWwO68FnXfpkGMZIorqssMD1luNyzA-_mGc
  - ← 302 Found
    - cache-control: public, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/plain
    - date: Sun, 12 Jul 2026 09:45:11 GMT
    - location: /onboarding
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..rfaXCnnlqi22o5eMiGymPA._nD3ZZZpv0F9_smWC-ZaSHCdyMRaccIhIwJC867xlAVzEjJGpXyNFmeBk85h7oFpm22pxxIyja3rtzLWuszE396cg7WuAVQckvP_EGqvs7BK5Kxs0ShZEkPtxPAXaW4_SbdE3-N1kwjTdKM8A1uMDQQFczR1srYP7i3huCHQh8w2ucWCOQfa7ftIU6pBszH5ma_0E1azKQK6eS2o1SIDV89-twgZw-wJcuDQ_2qxKcEhQM2lSyZcxGJwGc093I3oaY5NpKwCUkaoMY4VQwFffhOCbSsP9jv-BA9n0k-jrz8OyGQFnrxOdbwF-Wfs3GSQ6Bjo6oVjG0dNla730kqjWQ.Mrt1Qv9gmj10dMBykGDr8Ap3GLVYhRtecnEgnFjC-gE; Path=/; Expires=Tue, 11 Aug 2026 09:45:11 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-vercel-id: bom1::gh5hj-1783849511267-4e430a7e8c50
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/onboarding
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..rfaXCnnlqi22o5eMiGymPA._nD3ZZZpv0F9_smWC-ZaSHCdyMRaccIhIwJC867xlAVzEjJGpXyNFmeBk85h7oFpm22pxxIyja3rtzLWuszE396cg7WuAVQckvP_EGqvs7BK5Kxs0ShZEkPtxPAXaW4_SbdE3-N1kwjTdKM8A1uMDQQFczR1srYP7i3huCHQh8w2ucWCOQfa7ftIU6pBszH5ma_0E1azKQK6eS2o1SIDV89-twgZw-wJcuDQ_2qxKcEhQM2lSyZcxGJwGc093I3oaY5NpKwCUkaoMY4VQwFffhOCbSsP9jv-BA9n0k-jrz8OyGQFnrxOdbwF-Wfs3GSQ6Bjo6oVjG0dNla730kqjWQ.Mrt1Qv9gmj10dMBykGDr8Ap3GLVYhRtecnEgnFjC-gE
  - ← 307 Temporary Redirect
    - age: 0
    - cache-control: private, no-cache, no-store, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/html; charset=utf-8
    - date: Sun, 12 Jul 2026 09:45:12 GMT
    - link: </_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/chunks/233p45nuh4m5b.css>; rel=preload; as="style", </_next/static/chunks/0h2awhdfsm86k.css>; rel=preload; as="style"
    - location: /dashboard
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..3BjJhQVN0j90wqndHXZjPg.0QAcvJPaDiugMvvb1lzl-hlRdHrU3JNuuSIetzN6cK7URw9HkpQGtfWzuX4T2p5vwxxOXIROVJTSPd0xju8hDlMGxhilIxpGBqhle3eoP4URXM55SNME6pn-ZSHgIdIGzKRAQdbtr0wWaqHhlXE8XMcbJ1MME_dR8EKoty31pQjDGPLv1yQ0wGTw4aYx_nP81bSig9TgEcJ-6XLSgHlbqJHAVivWx-FdPeuQRjnYf7ti20mv1q6xsYQT1h9ZSVRBi0dLLIu0l_V9nS2KODmT93X0y3wNi-aYT2gZM4GRY88DC2s09DhEjkWeBt2QPrn9F0iun7SorIkhxjzymLha9w.4oA79TuLucV86w_B2SxiOW5JrWdXUg-QuzxEAA0erdg; Path=/; Expires=Tue, 11 Aug 2026 09:45:11 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-matched-path: /onboarding
    - x-powered-by: Next.js
    - x-vercel-cache: MISS
    - x-vercel-id: bom1::iad1::v6glz-1783849511533-870fefb6041a
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/dashboard
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..3BjJhQVN0j90wqndHXZjPg.0QAcvJPaDiugMvvb1lzl-hlRdHrU3JNuuSIetzN6cK7URw9HkpQGtfWzuX4T2p5vwxxOXIROVJTSPd0xju8hDlMGxhilIxpGBqhle3eoP4URXM55SNME6pn-ZSHgIdIGzKRAQdbtr0wWaqHhlXE8XMcbJ1MME_dR8EKoty31pQjDGPLv1yQ0wGTw4aYx_nP81bSig9TgEcJ-6XLSgHlbqJHAVivWx-FdPeuQRjnYf7ti20mv1q6xsYQT1h9ZSVRBi0dLLIu0l_V9nS2KODmT93X0y3wNi-aYT2gZM4GRY88DC2s09DhEjkWeBt2QPrn9F0iun7SorIkhxjzymLha9w.4oA79TuLucV86w_B2SxiOW5JrWdXUg-QuzxEAA0erdg
  - ← 302 Found
    - cache-control: public, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/plain
    - date: Sun, 12 Jul 2026 09:45:13 GMT
    - location: /onboarding
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..ZwTByd6yhYQKZRPQcLMh0A.MklMHMCwUuVKH6_GwMDSL5hQPf9JWhU54RGh2ZNutt0OLZDhpgX3eXEiLkPtbtpg8RE8DgaUV1fvA2-WQr3SmedwL_fJJ4afuWFFIMvWyRtYzhBA6rykdsXL8waFdG0bLG9uMRFuLMIK6FDylzvVOYrmUcVRFUm334WwNPv3-MkPuSEzaPmqBwg3XBnpVML9R7NCTEkQG4Yv0k9PMM9php9raQMsciGQT7TQh4f-Xs3j0M1eShUtniAIP3PvPe5lv-wdtq7qBDYLdcBAkUAOv1dzhO1CCGoyyl_8WPFYbBz8qxuK_4cJ7y1XZvOJEXmDgrCIpEDsLD3lpJHepvpjhg.pGW_ppBmJ33FL07g6kGBaXFH2Wt2cJLEKRqh529cB-Q; Path=/; Expires=Tue, 11 Aug 2026 09:45:13 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-vercel-id: bom1::g9jzd-1783849513612-155b17bc6316
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/onboarding
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..ZwTByd6yhYQKZRPQcLMh0A.MklMHMCwUuVKH6_GwMDSL5hQPf9JWhU54RGh2ZNutt0OLZDhpgX3eXEiLkPtbtpg8RE8DgaUV1fvA2-WQr3SmedwL_fJJ4afuWFFIMvWyRtYzhBA6rykdsXL8waFdG0bLG9uMRFuLMIK6FDylzvVOYrmUcVRFUm334WwNPv3-MkPuSEzaPmqBwg3XBnpVML9R7NCTEkQG4Yv0k9PMM9php9raQMsciGQT7TQh4f-Xs3j0M1eShUtniAIP3PvPe5lv-wdtq7qBDYLdcBAkUAOv1dzhO1CCGoyyl_8WPFYbBz8qxuK_4cJ7y1XZvOJEXmDgrCIpEDsLD3lpJHepvpjhg.pGW_ppBmJ33FL07g6kGBaXFH2Wt2cJLEKRqh529cB-Q
  - ← 307 Temporary Redirect
    - age: 0
    - cache-control: private, no-cache, no-store, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/html; charset=utf-8
    - date: Sun, 12 Jul 2026 09:45:14 GMT
    - link: </_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/chunks/233p45nuh4m5b.css>; rel=preload; as="style", </_next/static/chunks/0h2awhdfsm86k.css>; rel=preload; as="style"
    - location: /dashboard
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..SxmsZqAWwCeKrfrVL-rCxQ.AXhR3D2-AILrGeqMdrtGzUSo23LjIcKkWe94Gor8KXuz324tYFcaTypauGpLXeEYpGtEYWEqkPsFGisvTIQrw5uhte6ONJtcWK40N43CZ-s3-nauCxjevstO2Jz6BGpAA1caXtH9texo2ylO5MCVDdslAHAf58HHJb8LE-qNjTtHMChE6TjrYIWMoZhZZkfYFmOxS3s1vr8a8TGyPcBcpI3s00Qjp7J05LATEsFBa0q53ZMKvvO4ujjKHYFZXvww0NCzxvYyaXo-wZZzvAZaKnxlhVjX2Zl6Gic6acDlbkTUo86zGuu105LsG_2BxJYxJOmwsR6HY2MxUyX93Rwiyg.FtQNdtlRKa_Apu7iORmprw0-bGkzpIB6GwKOyx0lteI; Path=/; Expires=Tue, 11 Aug 2026 09:45:13 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-matched-path: /onboarding
    - x-powered-by: Next.js
    - x-vercel-cache: MISS
    - x-vercel-id: bom1::iad1::4f8pp-1783849513917-087f4b10a8ba
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/dashboard
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..SxmsZqAWwCeKrfrVL-rCxQ.AXhR3D2-AILrGeqMdrtGzUSo23LjIcKkWe94Gor8KXuz324tYFcaTypauGpLXeEYpGtEYWEqkPsFGisvTIQrw5uhte6ONJtcWK40N43CZ-s3-nauCxjevstO2Jz6BGpAA1caXtH9texo2ylO5MCVDdslAHAf58HHJb8LE-qNjTtHMChE6TjrYIWMoZhZZkfYFmOxS3s1vr8a8TGyPcBcpI3s00Qjp7J05LATEsFBa0q53ZMKvvO4ujjKHYFZXvww0NCzxvYyaXo-wZZzvAZaKnxlhVjX2Zl6Gic6acDlbkTUo86zGuu105LsG_2BxJYxJOmwsR6HY2MxUyX93Rwiyg.FtQNdtlRKa_Apu7iORmprw0-bGkzpIB6GwKOyx0lteI
  - ← 302 Found
    - cache-control: public, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/plain
    - date: Sun, 12 Jul 2026 09:45:15 GMT
    - location: /onboarding
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..BGuJjxmEQILI848WgIJeBA.nlXz-YnubvCwwDNG5F5ub6EplKy8EZ8it0s1jzsNxJn8DfvQgPURc-8dDmKO43NOU34bFQ6ceHVRMfTQs7EEauBsy1P-BTjSKCrNcjkzRPpX9DUdA8eb4-VsInC_hGftjVX8JAriy1fr4gefRkkssx2rHvdmnSmSLCs0vGqgyReuk6e9qUFNU2X-Xjr_6tvrLZGxH5cxHXd-nLGCPVa9umq7EFDnD54Jb2N8l5Qd2HSPsBayeQCLLmQuJPiPsAHx8LNzf9UYBcnrzFqnPu7HKuzNsuc5BA1feT3_hgSK4Dah7R7YEpxLg4q7Egpar5vo1XDNL8g6SONHVmNeIPcH7A.fOvpGQDPbcdCb6CtL6TTDdL8jeguvbA1bsTX2_aqvtw; Path=/; Expires=Tue, 11 Aug 2026 09:45:15 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-vercel-id: bom1::4ddb6-1783849514997-fa0000d0e8e8
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/onboarding
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..BGuJjxmEQILI848WgIJeBA.nlXz-YnubvCwwDNG5F5ub6EplKy8EZ8it0s1jzsNxJn8DfvQgPURc-8dDmKO43NOU34bFQ6ceHVRMfTQs7EEauBsy1P-BTjSKCrNcjkzRPpX9DUdA8eb4-VsInC_hGftjVX8JAriy1fr4gefRkkssx2rHvdmnSmSLCs0vGqgyReuk6e9qUFNU2X-Xjr_6tvrLZGxH5cxHXd-nLGCPVa9umq7EFDnD54Jb2N8l5Qd2HSPsBayeQCLLmQuJPiPsAHx8LNzf9UYBcnrzFqnPu7HKuzNsuc5BA1feT3_hgSK4Dah7R7YEpxLg4q7Egpar5vo1XDNL8g6SONHVmNeIPcH7A.fOvpGQDPbcdCb6CtL6TTDdL8jeguvbA1bsTX2_aqvtw
  - ← 307 Temporary Redirect
    - age: 0
    - cache-control: private, no-cache, no-store, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/html; charset=utf-8
    - date: Sun, 12 Jul 2026 09:45:15 GMT
    - link: </_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/chunks/233p45nuh4m5b.css>; rel=preload; as="style", </_next/static/chunks/0h2awhdfsm86k.css>; rel=preload; as="style"
    - location: /dashboard
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ.._QPWNV0uz168nW_Vp9-ETA.3vA6kr6w3q21RdL3rmAmRs1FmgamQBfmpbs1MwB52cW5i_V5NBiYw2x8ZbUhxtc0ygpLI-kTXWZB-nVpuAo2iY29U3PKefVibhWCyW6zcoYa9DjSSvFMnfylK9m7WupgQsVIQleVk-269hoRLn-i379W4Y07V_6kWxW0WqLfeRRhsv96-3zuntTsnuWEX0cawQo2MrkouKGhRA9KiDIL_ANl6ah_r_LKtNGTbOcZ9I-LXS_Nu2ohqetgBiFHxPUpewKYd0OOh4HxM5YLYIPADF-9v-T5gSO5_R6XDKXOLURmcd9bHPYRA_hvCG95vjZ3Jf3w4SGC6htVlOrOZMX9hQ.QT2su3g5jTf6-aU_QTQnDLV0OmsK1iLFbZ3tDobF-UU; Path=/; Expires=Tue, 11 Aug 2026 09:45:15 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-matched-path: /onboarding
    - x-powered-by: Next.js
    - x-vercel-cache: MISS
    - x-vercel-id: bom1::iad1::ltgst-1783849515378-fc7b9e184b64
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/dashboard
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ.._QPWNV0uz168nW_Vp9-ETA.3vA6kr6w3q21RdL3rmAmRs1FmgamQBfmpbs1MwB52cW5i_V5NBiYw2x8ZbUhxtc0ygpLI-kTXWZB-nVpuAo2iY29U3PKefVibhWCyW6zcoYa9DjSSvFMnfylK9m7WupgQsVIQleVk-269hoRLn-i379W4Y07V_6kWxW0WqLfeRRhsv96-3zuntTsnuWEX0cawQo2MrkouKGhRA9KiDIL_ANl6ah_r_LKtNGTbOcZ9I-LXS_Nu2ohqetgBiFHxPUpewKYd0OOh4HxM5YLYIPADF-9v-T5gSO5_R6XDKXOLURmcd9bHPYRA_hvCG95vjZ3Jf3w4SGC6htVlOrOZMX9hQ.QT2su3g5jTf6-aU_QTQnDLV0OmsK1iLFbZ3tDobF-UU
  - ← 302 Found
    - cache-control: public, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/plain
    - date: Sun, 12 Jul 2026 09:45:16 GMT
    - location: /onboarding
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..ReT3DLKbxzkWgQKEBgOP1w.bB5YontpD1VcltqhazGis3VyX--fcfJcbgjPr3egrTh14kY9C6EqL7Q_hIXjKd5Bb2U2V49MzyVHAV5qlQiMhG6dTBC1wZG8bC9cujTkwYHPJf4TyDztMLBwd5_U3wK83zkrj3K5w6GF2dvab5qa0djtcJxZ7sTABCbNgqNL0XtMq4DhpDyPqTfVNlr2E95Enjq9LXG0DYL2lvn4uxzaKt8FtiQEhEz3w10EQIiJcG6TCKrqnU2gCCbAvEtz7P2XbKM7L-3wXin48wfqueIPzzlJv9_UYaCPqNKgAiTzXsWtvcmexfXmzVq1dY1ZIvRbXNN7N22Wn-KzSE2y6UreMA.JC3O7HEDNNzXejZPwUmPpTf3lRFUVfHmY4_LgMNss-w; Path=/; Expires=Tue, 11 Aug 2026 09:45:16 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-vercel-id: bom1::cwbcb-1783849516068-743ec6cd2c9f
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/onboarding
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..ReT3DLKbxzkWgQKEBgOP1w.bB5YontpD1VcltqhazGis3VyX--fcfJcbgjPr3egrTh14kY9C6EqL7Q_hIXjKd5Bb2U2V49MzyVHAV5qlQiMhG6dTBC1wZG8bC9cujTkwYHPJf4TyDztMLBwd5_U3wK83zkrj3K5w6GF2dvab5qa0djtcJxZ7sTABCbNgqNL0XtMq4DhpDyPqTfVNlr2E95Enjq9LXG0DYL2lvn4uxzaKt8FtiQEhEz3w10EQIiJcG6TCKrqnU2gCCbAvEtz7P2XbKM7L-3wXin48wfqueIPzzlJv9_UYaCPqNKgAiTzXsWtvcmexfXmzVq1dY1ZIvRbXNN7N22Wn-KzSE2y6UreMA.JC3O7HEDNNzXejZPwUmPpTf3lRFUVfHmY4_LgMNss-w
  - ← 307 Temporary Redirect
    - age: 0
    - cache-control: private, no-cache, no-store, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/html; charset=utf-8
    - date: Sun, 12 Jul 2026 09:45:21 GMT
    - link: </_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/chunks/233p45nuh4m5b.css>; rel=preload; as="style", </_next/static/chunks/0h2awhdfsm86k.css>; rel=preload; as="style"
    - location: /dashboard
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..YLE1zmXeGsxkVDiNzutxHg.zDBTT3WFo3H2gIuaaGAmFOTN3LF8JREnTLGuI1eOwt-KoQyMmd_yskWjcrdg0ux1KsSdootKk4pZKwA23InfPQdY9NoEJFhLUS3wiT1-ZfXLl7zNlN7tAfrkb2Clf0YeSdDzvjamWFChEpF-1_7nREZ0gaRyPw3c1iBC381veQL43cirpdpj0JKJSuSRWnaUj8q9yyDWiFq2XXksf544yRjO9P-ySMrvtV1m5PialssIuLv_WQNHImzcpMrOHmThivh5fLZWPXysdDS2WU1Q85fc8EI8Bof--SUsr56VwHNG0GUCjjftrUeRYYCUa7miK9MEx3_aJKwZ1XeQ4Kv9oQ.CHs_TDYPlVvz5idWy06D57QqXD46EiQWawC88HbQMLI; Path=/; Expires=Tue, 11 Aug 2026 09:45:21 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-matched-path: /onboarding
    - x-powered-by: Next.js
    - x-vercel-cache: MISS
    - x-vercel-id: bom1::iad1::cwbcb-1783849521127-94043527ed19
    - transfer-encoding: chunked
  - → GET https://careeros-iota.vercel.app/dashboard
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - cookie: __Host-authjs.csrf-token=b234ff4ad6e6b9a0e6c09de74332779825c410c7467cd26da6015eed7854d003%7C9f1107dd1d30d250de95c9aa1c9531cda159b5a450874d237ca9f7a8ac6e8f9f; __Secure-authjs.callback-url=https%3A%2F%2Fcareeros-iota.vercel.app%2Fregister; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..YLE1zmXeGsxkVDiNzutxHg.zDBTT3WFo3H2gIuaaGAmFOTN3LF8JREnTLGuI1eOwt-KoQyMmd_yskWjcrdg0ux1KsSdootKk4pZKwA23InfPQdY9NoEJFhLUS3wiT1-ZfXLl7zNlN7tAfrkb2Clf0YeSdDzvjamWFChEpF-1_7nREZ0gaRyPw3c1iBC381veQL43cirpdpj0JKJSuSRWnaUj8q9yyDWiFq2XXksf544yRjO9P-ySMrvtV1m5PialssIuLv_WQNHImzcpMrOHmThivh5fLZWPXysdDS2WU1Q85fc8EI8Bof--SUsr56VwHNG0GUCjjftrUeRYYCUa7miK9MEx3_aJKwZ1XeQ4Kv9oQ.CHs_TDYPlVvz5idWy06D57QqXD46EiQWawC88HbQMLI
  - ← 302 Found
    - cache-control: public, max-age=0, must-revalidate
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'
    - content-type: text/plain
    - date: Sun, 12 Jul 2026 09:45:22 GMT
    - location: /onboarding
    - referrer-policy: strict-origin-when-cross-origin
    - server: Vercel
    - set-cookie: __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicklBcW1nVGFOWThSUHNBUWRyN2tnWUJ4Q0hPMkowQkQ5TTN4T3haSWcxNDRzV2lod3lGdVphS19fVmhYalU4TzhJb1lvQ3hsX2RnZjhYWnk3cnNfN0EifQ..fXe5J5eVDfTju1SkzoQXgg.p-cw6jnh51I2tT0Z4O6YC796kTuGoZAx8H_WaZkW0ua15gHX4YB2ALoCJ4HVap4m0L99u4QIcZPSNzV74Y1CUZK66VkyQ_9fgwzV9Px4fRMrUg9LhJer3VmmJ3nK3mmG6lyrmBG64IGZCDOrJOILRXEjH-tKmDbr60LNhnhgHl7DSiN-lEqw6N_-n2Tn477EhUiNQBXrXCYJdQ-Ezf0zGNHgFrA2JuaBMEguofkuMgQXnEDiSFU_U1275vhw-8b60qK2li1AsD9hFHF3R-mY6Uv7lydsJ8sP28P8NT99320dr1pjFKMyFoTLmX_vG-eeWHRlJTI87gNp6PGD3qS4qA.wjPuER3MHuEG-LI_RiD1zCzSzvtCzoFG3EiS5ptxI3c; Path=/; Expires=Tue, 11 Aug 2026 09:45:22 GMT; HttpOnly; Secure; SameSite=Lax
    - strict-transport-security: max-age=31536000; includeSubDomains
    - x-content-type-options: nosniff
    - x-frame-options: DENY
    - x-vercel-id: bom1::th6nw-1783849522118-c6e690f21561
    - transfer-encoding: chunked

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]: Onboarding | CareerOS AI
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img [ref=e8]
        - generic [ref=e11]: CareerOS
      - generic [ref=e13]:
        - generic [ref=e14]:
          - img [ref=e15]
          - text: System Initialization
        - heading "Your Career. Operating System." [level=1] [ref=e17]:
          - text: Your Career.
          - text: Operating System.
        - paragraph [ref=e18]: We're building your Master Career Profile. This will act as the brain for your tailored resumes, applications, and mock interviews.
        - button "Initialize Profile" [ref=e19]:
          - text: Initialize Profile
          - img
    - generic [ref=e22]:
      - generic [ref=e23]:
        - img [ref=e25]
        - generic [ref=e28]:
          - generic [ref=e29]: Career Identity
          - generic [ref=e30]: Master Profile
      - generic [ref=e31]:
        - img [ref=e33]
        - generic [ref=e37]:
          - generic [ref=e38]: Job Search
          - generic [ref=e39]: Intelligence
      - generic [ref=e40]:
        - img [ref=e42]
        - generic [ref=e46]:
          - generic [ref=e47]: Practice
          - generic [ref=e48]: Arenas
      - generic [ref=e49]:
        - img [ref=e51]
        - generic [ref=e54]:
          - generic [ref=e55]: Utility
          - generic [ref=e56]: Studio
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | const PROD_URL = 'https://careeros-iota.vercel.app';
  4   | 
  5   | test.describe('CareerOS Production E2E Tests', () => {
  6   |   const user1Email = `testuser1_${Date.now()}@example.com`;
  7   |   const user2Email = `testuser2_${Date.now()}@example.com`;
  8   |   const password = 'Password123!';
  9   |   const name = 'Test User';
  10  | 
  11  |   test.describe.configure({ mode: 'serial' });
  12  | 
  13  |   test('User 1: Signup, Onboarding, and Routing', async ({ page }) => {
  14  |     test.setTimeout(60000);
  15  |     // 1. Signup — button now says "Create Account"
  16  |     await page.goto(`${PROD_URL}/register`);
  17  |     await page.getByLabel('Full Name').fill(name);
  18  |     await page.getByLabel('Email').fill(user1Email);
  19  |     // Password label has trailing "(min 8 characters)" — use exact:false
  20  |     await page.getByLabel('Password', { exact: false }).fill(password);
  21  |     await page.getByRole('button', { name: 'Create Account' }).click();
  22  | 
  23  |     // After register, new flow: auto-signin → /onboarding (no intermediate /login step)
  24  |     await page.waitForURL('**/onboarding', { timeout: 30000 });
  25  |     expect(page.url()).toContain('/onboarding');
  26  | 
  27  |     // 2. API Validations for Core Modules (session cookie carried by page.request)
  28  | 
  29  |     // A. Profile Persistence
  30  |     const profileRes = await page.request.post(`${PROD_URL}/api/profile/save`, {
  31  |       data: {
  32  |         facts: {
  33  |           basics: {
  34  |             value: {
  35  |               domain: 'Engineering',
  36  |               department: 'Software',
  37  |               targetRole: 'Full Stack Developer',
  38  |               careerGoal: 'Build great products'
  39  |             }
  40  |           }
  41  |         }
  42  |       }
  43  |     });
  44  |     expect(profileRes.status()).toBe(200);
  45  | 
  46  |     // B. Application Tracker CRUD — Create
  47  |     const createRes = await page.request.post(`${PROD_URL}/api/applications`, {
  48  |       data: { company: 'Vercel', roleTitle: 'Engineer', status: 'SAVED', notes: 'Test note' }
  49  |     });
  50  |     expect(createRes.status()).toBe(200);
  51  |     const createdApp = await createRes.json();
  52  |     expect(createdApp.application.id).toBeDefined();
  53  | 
  54  |     // Read
  55  |     const readRes = await page.request.get(`${PROD_URL}/api/applications`);
  56  |     expect(readRes.status()).toBe(200);
  57  |     const appsBody = await readRes.json();
  58  |     expect(appsBody.applications.length).toBeGreaterThan(0);
  59  | 
  60  |     // C. Assessments list loads
  61  |     const assessRes = await page.request.get(`${PROD_URL}/api/assessments`);
  62  |     expect(assessRes.status()).toBe(200);
  63  | 
  64  |     // D. Dashboard pages return 200 (not 500)
> 65  |     const perfRes = await page.request.get(`${PROD_URL}/dashboard/performance`);
      |                                        ^ Error: apiRequestContext.get: Max redirect count exceeded
  66  |     expect(perfRes.status()).toBe(200);
  67  | 
  68  |     const achRes = await page.request.get(`${PROD_URL}/dashboard/achievements`);
  69  |     expect(achRes.status()).toBe(200);
  70  | 
  71  |     // 3. Logout via Auth.js signout endpoint
  72  |     await page.goto(`${PROD_URL}/api/auth/signout`);
  73  |     const signoutBtn = page.getByRole('button', { name: /sign out/i });
  74  |     if (await signoutBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  75  |       await signoutBtn.click();
  76  |       await page.waitForLoadState('networkidle');
  77  |     }
  78  |   });
  79  | 
  80  |   test('User 2: Cross Account Isolation', async ({ page }) => {
  81  |     test.setTimeout(60000);
  82  |     // Signup user 2
  83  |     await page.goto(`${PROD_URL}/register`);
  84  |     await page.getByLabel('Full Name').fill(name);
  85  |     await page.getByLabel('Email').fill(user2Email);
  86  |     await page.getByLabel('Password', { exact: false }).fill(password);
  87  |     await page.getByRole('button', { name: 'Create Account' }).click();
  88  | 
  89  |     // New flow goes directly to /onboarding
  90  |     await page.waitForURL('**/onboarding', { timeout: 30000 });
  91  | 
  92  |     // User 2's application list must be empty (proving cross-user isolation)
  93  |     const response = await page.request.get(`${PROD_URL}/api/applications`);
  94  |     expect(response.status()).toBe(200);
  95  |     const body = await response.json();
  96  |     expect(body.applications).toEqual([]);
  97  |   });
  98  | 
  99  |   test('Mobile Viewport Login', async ({ page }) => {
  100 |     test.setTimeout(60000);
  101 |     await page.setViewportSize({ width: 375, height: 667 });
  102 |     await page.goto(`${PROD_URL}/login`);
  103 |     await page.getByLabel('Email').fill(user1Email);
  104 |     await page.getByLabel('Password', { exact: false }).fill(password);
  105 |     await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  106 |     // User 1 completed onboarding? If not, may land on /onboarding again
  107 |     await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 30000 });
  108 |     expect(page.url()).toMatch(/\/(dashboard|onboarding)/);
  109 |   });
  110 | 
  111 |   test('Core Workflows & Tools', async ({ page }) => {
  112 |     test.setTimeout(90000);
  113 |     // Login as User 1
  114 |     await page.goto(`${PROD_URL}/login`);
  115 |     await page.getByLabel('Email').fill(user1Email);
  116 |     await page.getByLabel('Password', { exact: false }).fill(password);
  117 |     await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  118 |     await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 30000 });
  119 | 
  120 |     // 1. Resume Creation (API)
  121 |     const resumeRes = await page.request.post(`${PROD_URL}/api/resumes`, {
  122 |       data: { mode: 'BLANK', title: 'E2E Blank Resume' }
  123 |     });
  124 |     expect(resumeRes.status()).toBe(200);
  125 |     const createdResume = await resumeRes.json();
  126 | 
  127 |     // 2. Job Intelligence (Native Engine)
  128 |     const jobRes = await page.request.post(`${PROD_URL}/api/jobs/analyze`, {
  129 |       data: { text: 'Looking for a software engineer with Next.js experience.', sourceType: 'TEXT' }
  130 |     });
  131 |     expect(jobRes.status()).toBe(200);
  132 | 
  133 |     // 3. ATS Analysis (fetch version ID first)
  134 |     const resumeDetailsRes = await page.request.get(`${PROD_URL}/api/resumes/${createdResume.resumeId}`);
  135 |     expect(resumeDetailsRes.status()).toBe(200);
  136 |     const resumeDetails = await resumeDetailsRes.json();
  137 |     const versionId = resumeDetails.resume.versions[0].id;
  138 | 
  139 |     const atsRes = await page.request.post(
  140 |       `${PROD_URL}/api/resumes/${createdResume.resumeId}/versions/${versionId}/ats`
  141 |     );
  142 |     expect(atsRes.status()).toBe(200);
  143 | 
  144 |     // 4. Utility Studio Navigation
  145 |     await page.goto(`${PROD_URL}/dashboard/tools`);
  146 |     expect(page.url()).toContain('/dashboard/tools');
  147 |   });
  148 | 
  149 |   test('Error States & Unauthorized Access', async ({ request, page }) => {
  150 |     test.setTimeout(30000);
  151 |     // 1. 401 on unauthenticated API access
  152 |     const unauthorizedRes = await request.get(`${PROD_URL}/api/profile`);
  153 |     expect(unauthorizedRes.status()).toBe(401);
  154 | 
  155 |     // 2. Dashboard redirects unauthenticated user to /login (302/200 after redirect)
  156 |     const dashRes = await page.goto(`${PROD_URL}/dashboard`);
  157 |     expect(page.url()).toContain('/login');
  158 |   });
  159 | });
  160 | 
```