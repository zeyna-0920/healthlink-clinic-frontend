#!/bin/bash
# Script pour démarrer frontend et backend ensemble (depuis frontend/)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/frontend" || exit 1

echo "🚀 Démarrage de HealthLink Clinic..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

npm run dev:all

echo ""
echo "✅ Accédez à:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Dashboard: http://localhost:3000/dashboard"
