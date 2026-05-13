#!/bin/bash
# Script pour démarrer frontend et backend ensemble

echo "🚀 Démarrage de HealthLink Clinic..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

npm run dev:all

echo ""
echo "✅ Accédez à:"
echo "   Frontend: http://localhost:3001"
echo "   Backend:  http://localhost:5000"
echo "   Dashboard: http://localhost:3001/dashboard"
