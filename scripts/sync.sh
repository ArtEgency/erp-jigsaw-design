#!/bin/bash
# ═══════════════════════════════════════════════════════
# Jigsaw Design System — Sync Script
# Copy shared icons + components ไปทั้ง JAS และ Tenant
# ═══════════════════════════════════════════════════════

DESIGN_DIR="$(cd "$(dirname "$0")/.." && pwd)"
COWORK_DIR="$(dirname "$DESIGN_DIR")"
JAS_DIR="$COWORK_DIR/erp-jigsaw-jas"
TENANT_DIR="$COWORK_DIR/erp-jigsaw-tenant"

echo "═══════════════════════════════════════════"
echo "  Jigsaw Design System — Sync"
echo "═══════════════════════════════════════════"
echo ""
echo "Source:  $DESIGN_DIR"
echo "JAS:     $JAS_DIR"
echo "Tenant:  $TENANT_DIR"
echo ""

# ── Sync Icons ──
echo "📦 Syncing icons..."
if [ -d "$JAS_DIR" ]; then
  rm -rf "$JAS_DIR/public/icons"
  cp -r "$DESIGN_DIR/public/icons" "$JAS_DIR/public/icons"
  echo "  ✅ Icons → JAS"
else
  echo "  ⚠️  JAS directory not found, skipping"
fi

if [ -d "$TENANT_DIR" ]; then
  rm -rf "$TENANT_DIR/public/icons"
  cp -r "$DESIGN_DIR/public/icons" "$TENANT_DIR/public/icons"
  echo "  ✅ Icons → Tenant"
else
  echo "  ⚠️  Tenant directory not found, skipping"
fi

# ── Sync Components ──
echo ""
echo "📦 Syncing components..."
if [ -d "$JAS_DIR" ]; then
  rm -rf "$JAS_DIR/src/components/ui"
  cp -r "$DESIGN_DIR/src/components/ui" "$JAS_DIR/src/components/ui"
  rm -rf "$JAS_DIR/src/components/layout"
  cp -r "$DESIGN_DIR/src/components/layout" "$JAS_DIR/src/components/layout"
  echo "  ✅ Components → JAS"
fi

if [ -d "$TENANT_DIR" ]; then
  rm -rf "$TENANT_DIR/src/components/ui"
  cp -r "$DESIGN_DIR/src/components/ui" "$TENANT_DIR/src/components/ui"
  rm -rf "$TENANT_DIR/src/components/layout"
  cp -r "$DESIGN_DIR/src/components/layout" "$TENANT_DIR/src/components/layout"
  echo "  ✅ Components → Tenant"
fi

# ── Sync Theme ──
echo ""
echo "📦 Syncing theme..."
if [ -d "$JAS_DIR" ]; then
  cp "$DESIGN_DIR/src/lib/theme.ts" "$JAS_DIR/src/lib/theme.ts"
  cp "$DESIGN_DIR/src/lib/MuiThemeProvider.tsx" "$JAS_DIR/src/lib/MuiThemeProvider.tsx"
  echo "  ✅ Theme → JAS"
fi

if [ -d "$TENANT_DIR" ]; then
  cp "$DESIGN_DIR/src/lib/theme.ts" "$TENANT_DIR/src/lib/theme.ts"
  cp "$DESIGN_DIR/src/lib/MuiThemeProvider.tsx" "$TENANT_DIR/src/lib/MuiThemeProvider.tsx"
  echo "  ✅ Theme → Tenant"
fi

echo ""
echo "═══════════════════════════════════════════"
echo "  ✅ Sync complete!"
echo "═══════════════════════════════════════════"
