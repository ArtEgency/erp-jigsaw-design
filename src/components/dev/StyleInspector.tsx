"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

/**
 * StyleInspector — กด "Show Style" แล้ว hover ที่ element ใดก็ได้
 * แสดง tooltip บอก: size, padding, font, color, border-radius
 *
 * ออกจากโหมด:
 * - กดปุ่ม "✕ Hide Style" อีกครั้ง
 * - กด Escape
 * - กดปุ่ม X ที่แถบบนสุด
 */
export function StyleInspector() {
  const [active, setActive] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const hoveredRef = useRef<HTMLElement | null>(null);
  const btnRef = useRef<HTMLDivElement | null>(null);

  const deactivate = useCallback(() => {
    if (hoveredRef.current) {
      hoveredRef.current.style.outline = "";
      hoveredRef.current = null;
    }
    setActive(false);
    setInfo(null);
    document.body.style.cursor = "";
  }, []);

  // Escape key to exit
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && active) deactivate();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [active, deactivate]);

  // Mouse move handler
  useEffect(() => {
    if (!active) return;
    document.body.style.cursor = "crosshair";

    const handleMove = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!el || el === hoveredRef.current) {
        setPos({ x: e.clientX + 16, y: e.clientY + 16 });
        return;
      }

      // Skip our own inspector elements
      if (btnRef.current?.contains(el)) return;
      const isInspectorEl = el.closest("[data-style-inspector]");
      if (isInspectorEl) return;

      // Remove old outline
      if (hoveredRef.current) hoveredRef.current.style.outline = "";

      // Add outline
      el.style.outline = "2px solid #7C3AED";
      hoveredRef.current = el;

      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      const lines = [
        `📐 Size: ${Math.round(rect.width)} × ${Math.round(rect.height)} px`,
        `📏 Padding: ${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
        `📏 Margin: ${cs.marginTop} ${cs.marginRight} ${cs.marginBottom} ${cs.marginLeft}`,
        `🔤 Font: ${cs.fontWeight} ${cs.fontSize} / ${cs.lineHeight}`,
        `🔤 Family: ${cs.fontFamily.split(",")[0].replace(/['"]/g, "")}`,
        `🎨 Color: ${rgbToHex(cs.color)}`,
        `🖼 Background: ${cs.backgroundColor === "rgba(0, 0, 0, 0)" ? "transparent" : rgbToHex(cs.backgroundColor)}`,
        cs.borderRadius !== "0px" ? `⬜ Radius: ${cs.borderRadius}` : null,
        cs.borderWidth !== "0px" ? `🔲 Border: ${cs.borderWidth} ${cs.borderStyle} ${rgbToHex(cs.borderColor)}` : null,
        `🏷 Tag: <${el.tagName.toLowerCase()}${el.className ? ` .${String(el.className).split(" ")[0].slice(0, 20)}` : ""}>`,
      ].filter(Boolean);

      setInfo(lines.join("\n"));
      setPos({ x: e.clientX + 16, y: e.clientY + 16 });
    };

    const handleClick = (e: MouseEvent) => {
      // Allow clicking our own button
      if (btnRef.current?.contains(e.target as Node)) return;
      const isInspectorEl = (e.target as HTMLElement)?.closest("[data-style-inspector]");
      if (isInspectorEl) return;
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener("mousemove", handleMove, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("mousemove", handleMove, true);
      document.removeEventListener("click", handleClick, true);
      document.body.style.cursor = "";
      if (hoveredRef.current) {
        hoveredRef.current.style.outline = "";
        hoveredRef.current = null;
      }
    };
  }, [active]);

  return (
    <>
      {/* Toggle Button */}
      <Tooltip title={active ? "กด ESC หรือคลิกเพื่อปิด" : "เปิด Style Inspector"} placement="left" arrow>
        <Box
          ref={btnRef}
          data-style-inspector="button"
          onClick={() => active ? deactivate() : setActive(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 90,
            zIndex: 99999,
            bgcolor: active ? "#7C3AED" : "#6B7280",
            color: "white",
            height: 40,
            px: 2,
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: active ? "0 0 0 3px rgba(124,58,237,0.3), 0 2px 12px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.2)",
            fontSize: 12,
            fontWeight: 600,
            gap: 0.5,
            transition: "all 0.2s",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          {active ? "✕ Hide Style" : "🎨 Show Style"}
        </Box>
      </Tooltip>

      {/* Active: Top bar with exit button */}
      {active && (
        <Box
          data-style-inspector="bar"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 36,
            bgcolor: "#7C3AED",
            zIndex: 99998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Box sx={{ fontSize: 12, color: "white", fontWeight: 500 }}>
            🎨 Style Inspector Mode — Hover เพื่อดู Style | กด <strong>ESC</strong> หรือ
          </Box>
          <Box
            data-style-inspector="close"
            onClick={deactivate}
            sx={{
              fontSize: 12,
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              bgcolor: "rgba(255,255,255,0.2)",
              px: 1.5,
              py: 0.3,
              borderRadius: "4px",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
            }}
          >
            ✕ ปิด
          </Box>
        </Box>
      )}

      {/* Floating tooltip */}
      {active && info && (
        <Box
          data-style-inspector="tooltip"
          sx={{
            position: "fixed",
            left: Math.min(pos.x, (typeof window !== "undefined" ? window.innerWidth - 320 : 1000)),
            top: Math.min(pos.y, (typeof window !== "undefined" ? window.innerHeight - 250 : 600)),
            zIndex: 99999,
            bgcolor: "rgba(20,20,20,0.95)",
            color: "white",
            px: 2,
            py: 1.5,
            borderRadius: "10px",
            fontSize: 12,
            fontFamily: "'SF Mono', 'Fira Code', monospace",
            whiteSpace: "pre",
            lineHeight: 1.8,
            pointerEvents: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            maxWidth: 380,
            border: "1px solid rgba(124,58,237,0.6)",
          }}
        >
          {info}
        </Box>
      )}
    </>
  );
}

function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb;
  const r = parseInt(match[1]).toString(16).padStart(2, "0");
  const g = parseInt(match[2]).toString(16).padStart(2, "0");
  const b = parseInt(match[3]).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`.toUpperCase();
}
