"use client";

import { Box, Tooltip } from "@mui/material";
import type { ApprovalStatus } from "@/data/component-status";

interface Props {
  status?: ApprovalStatus;
}

/**
 * ApprovalBadge — แสดงสถานะ Approved / Waiting Approve
 * ขนาดเล็ก สีจางๆ ไม่รบกวนสายตา
 */
export default function ApprovalBadge({ status = "waiting" }: Props) {
  if (status === "approved") {
    return (
      <Box
        component="span"
        sx={{
          display: "inline-flex", alignItems: "center", gap: 0.4,
          fontSize: "0.65rem", fontWeight: 500, lineHeight: 1,
          color: "#3B6D11", bgcolor: "#EAF3DE",
          px: 0.8, py: 0.3, borderRadius: 1,
          border: "1px solid #C0DD9766",
          whiteSpace: "nowrap", userSelect: "none",
        }}
      >
        <Box component="span" sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#3B6D11", flexShrink: 0 }} />
        Approved
      </Box>
    );
  }

  return (
    <Tooltip title="AI-generated — รอ Design Review" arrow placement="top">
      <Box
        component="span"
        sx={{
          display: "inline-flex", alignItems: "center", gap: 0.4,
          fontSize: "0.65rem", fontWeight: 500, lineHeight: 1,
          color: "#D44", bgcolor: "#FEE2E2",
          px: 0.8, py: 0.3, borderRadius: 1,
          border: "1px solid #FECACA66",
          whiteSpace: "nowrap", userSelect: "none",
          cursor: "help",
        }}
      >
        <Box component="span" sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#D44", flexShrink: 0 }} />
        Waiting Approve
      </Box>
    </Tooltip>
  );
}
