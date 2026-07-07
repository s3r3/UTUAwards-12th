#!/usr/bin/env bash
set -e
cd /home/xyconix11x/Ayid/xyconix11x/webdev/arsip/Lomba/meutuah
npx prisma db push --accept-data-loss 2>&1
npx tsx prisma/seed.ts 2>&1
npx tsc --noEmit 2>&1
echo "ALL DONE"
