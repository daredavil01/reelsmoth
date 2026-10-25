#!/usr/bin/env bash
# End-to-end check of the render pipeline: typecheck, render the Hello master,
# encode every landscape preset, check each export, build a contact sheet.
source "$(dirname "$0")/lib.sh"
cd "$ROOT"

npx tsc --noEmit
scripts/master.sh Hello hello
scripts/encode.sh hello youtube whatsapp whatsapp-api linkedin x web web-loop

fail=0
check() { scripts/check.sh "videos/hello/exports/$1" "${2:-}" || fail=1; }
check youtube.mp4 youtube
check whatsapp.mp4 whatsapp
check whatsapp-api.mp4 whatsapp-api
check linkedin.mp4 linkedin
check x.mp4 x
check web.mp4 web
check web.vp9.webm
check web.av1.webm
check loop.mp4 web-loop

scripts/contact-sheet.sh videos/hello/exports/youtube.mp4 src/compositions/hello.timeline.json videos/hello/contact-sheet.png
[[ $fail -eq 0 ]] && echo "SMOKE OK" || { echo "SMOKE FAILED"; exit 1; }
