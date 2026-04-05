"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Paper, Button, Chip, Table, TableHead, TableBody, TableRow, TableCell, TextField, Stack, Avatar, MenuItem, Tabs, Tab, IconButton, Tooltip, Dialog, DialogContent, DialogActions } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
// ActionButtons used in DataList — referenced by description only

const SA = "#FF6B00"; // SA Primary color

/* ══════════════════════════════════════════════════
   Template Categories & Items
   ══════════════════════════════════════════════════ */
interface TemplateItem {
  id: string;
  label: string;
  labelEn: string;
  description?: string;
}

interface TemplateCategory {
  id: string;
  label: string;
  labelEn: string;
  icon: React.ReactNode;
  items: TemplateItem[];
}

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: "datalist",
    label: "Datalist",
    labelEn: "Datalist",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
    items: [
      { id: "datalist-standard", label: "DataList Standard", labelEn: "DataList Standard", description: "MUI X DataGrid + Filter Bar + Sub-tabs + Avatar + Chip สถานะ + ActionButtons + Pagination" },
      { id: "product-list", label: "รายการสินค้า", labelEn: "Product List", description: "ตารางสินค้า + Filter + SubTabs" },
      { id: "employee-list", label: "รายชื่อพนักงาน", labelEn: "Employee List", description: "ตารางพนักงาน + DataGrid + Tab" },
    ],
  },
  {
    id: "interaction",
    label: "Interaction",
    labelEn: "Interaction",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>,
    items: [
      { id: "meatball-menu", label: "Meatball Menu", labelEn: "Meatball Menu", description: "Popup เมนูจากปุ่ม ⋮ — ส่ง Email, Reset รหัสผ่าน, แก้ไข, ระงับ" },
      { id: "modal-size-m", label: "Modal Size M", labelEn: "Modal Size M", description: "MUI Dialog 820×507 + Resizable + Header ส้ม + Form fields + Footer ยกเลิก/บันทึก" },
      { id: "confirm-modal", label: "Confirm Modal", labelEn: "Confirm Modal", description: "Modal ยืนยันการกระทำ — แถบสีบน + ข้อความกลาง + ปุ่ม ไม่ใช่/ใช่ ตาม Figma" },
    ],
  },
  {
    id: "document",
    label: "เอกสาร",
    labelEn: "Documents",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    items: [
      { id: "quotation", label: "ใบเสนอราคา", labelEn: "Quotation", description: "ฟอร์มเอกสาร + Header/Detail + พิมพ์" },
      { id: "invoice", label: "ใบแจ้งหนี้", labelEn: "Invoice", description: "ฟอร์มเอกสาร + สถานะชำระ + Export PDF" },
      { id: "receipt", label: "ใบเสร็จรับเงิน", labelEn: "Receipt", description: "ฟอร์มเอกสาร + QR Payment" },
    ],
  },
  {
    id: "form",
    label: "ฟอร์ม",
    labelEn: "Forms",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>,
    items: [
      { id: "create-account", label: "สร้าง Master Account", labelEn: "Create Master Account", description: "FormDialog + TextField + Select + Validation" },
      { id: "create-tenant", label: "สร้าง Tenant", labelEn: "Create Tenant", description: "SlidePanel + ToggleButton + Radio + Contract" },
      { id: "form-with-tab-1", label: "Form with Tab 1", labelEn: "Form with Tab 1", description: "Form + Tabs + View/Edit Mode สลับได้ + Status Toggle + Confirm Modal + 4 columns layout" },
    ],
  },
  {
    id: "dashboard",
    label: "Dashboard",
    labelEn: "Dashboard",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    items: [
      { id: "overview", label: "ภาพรวม", labelEn: "Overview", description: "Welcome card + Stats + Quick actions" },
    ],
  },
];

/* ══════════════════════════════════════════════════
   Sample Template Previews
   ══════════════════════════════════════════════════ */
/* ── DataList Standard — sample data ── */
const SAMPLE_ROWS = [
  { id: "MA-69-03-0001", name: "สมชาย วงศ์ใหญ่", position: "ผู้จัดการทั่วไป", customerGroup: "ขายส่ง", email: "somchai@siamgroup.co.th", phone: "081-234-5678", emailVerifiedAt: "26/03/2569 14:32", tenantUsed: 1, tenantQuota: 3, status: "เปิดใช้งาน" },
  { id: "MA-69-03-0002", name: "วิภา รัตนพันธ์", position: "CEO", customerGroup: "ขายปลีก", email: "wipa@thaimart.co.th", phone: "089-456-7890", emailVerifiedAt: "", tenantUsed: 0, tenantQuota: 5, status: "รอยืนยัน Email" },
  { id: "MA-69-03-0003", name: "ประกิต สมบูรณ์ชัย", position: "IT Manager", customerGroup: "ทั่วไป", email: "prakit@enterprise-sol.co.th", phone: "062-123-9999", emailVerifiedAt: "20/03/2569 09:15", tenantUsed: 2, tenantQuota: 2, status: "เปิดใช้งาน" },
  { id: "MA-69-03-0004", name: "ชัยชนะ มงคล", position: "ผู้จัดการทั่วไป", customerGroup: "ขายปลีก", email: "chaichana@mongkol.co.th", phone: "062-345-8965", emailVerifiedAt: "20/03/2569", tenantUsed: 1, tenantQuota: 3, status: "ระงับ Account" },
  { id: "MA-69-03-0005", name: "นารี สุขสันต์", position: "เจ้าหน้าที่", customerGroup: "ทั่วไป", email: "naree@example.co.th", phone: "084-567-8901", emailVerifiedAt: "18/03/2569", tenantUsed: 1, tenantQuota: 2, status: "เปิดใช้งาน" },
];

/* ── DataList Columns — ใช้ค่ามาตรฐานจาก Typo & Font Size ── */
const DATALIST_COLUMNS: GridColDef[] = [
  {
    field: "id",
    headerName: "รหัส Account",
    width: 150,
    renderCell: (params: GridRenderCellParams) => (
      <Typography sx={{ fontSize: 14, fontWeight: 500, color: SA, cursor: "pointer" }}>{params.value}</Typography>
    ),
  },
  {
    field: "name",
    headerName: "ชื่อ-นามสกุล",
    width: 260,
    renderCell: (params: GridRenderCellParams) => (
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ height: "100%" }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: SA, fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
          {(params.value as string)?.charAt(0)}
        </Avatar>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "2px", py: 1 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.3 }}>{params.value}</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#6B7280", lineHeight: 1.2 }}>{params.row.position}</Typography>
        </Box>
      </Stack>
    ),
  },
  { field: "customerGroup", headerName: "กลุ่มลูกค้า", width: 110 },
  { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
  { field: "phone", headerName: "เบอร์โทรศัพท์", width: 140 },
  {
    field: "emailVerifiedAt",
    headerName: "วันที่ยืนยัน Email",
    width: 160,
    renderCell: (params: GridRenderCellParams) => (
      <Typography sx={{ fontSize: 14, fontWeight: 400, color: "#1A1A1A" }}>{params.value || "—"}</Typography>
    ),
  },
  {
    field: "tenantQuota",
    headerName: "จำนวนธุรกิจ (Quota)",
    width: 150,
    align: "center",
    headerAlign: "center",
    renderCell: (params: GridRenderCellParams) => (
      <Typography sx={{ fontSize: 14 }}>
        <span style={{ color: SA, fontWeight: 600 }}>{params.row.tenantUsed}</span>
        <span style={{ color: "#1A1A1A" }}>/{params.row.tenantQuota}</span>
      </Typography>
    ),
  },
  {
    field: "status",
    headerName: "สถานะ",
    width: 160,
    renderCell: (params: GridRenderCellParams) => {
      const s = params.value as string;
      return (
        <Chip
          label={s}
          size="small"
          sx={{
            fontWeight: 500, fontSize: 12, height: 24,
            ...(s === "เปิดใช้งาน"
              ? { bgcolor: "rgba(238,251,229,0.98)", color: "#3B6D11" }
              : s === "รอยืนยัน Email"
              ? { bgcolor: "#FFF0E5", color: "#FF8228" }
              : s === "ระงับ Account"
              ? { bgcolor: "#FFF0E5", color: "#FF8228", border: "1px solid #FF8228" }
              : { bgcolor: "#F0F0F0", color: "#999" }),
          }}
        />
      );
    },
  },
  {
    field: "actions",
    headerName: "จัดการ",
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: () => (
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton size="small" sx={{ p: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/actions/edit.svg" alt="edit" width={28} height={28} />
        </IconButton>
        <IconButton size="small" sx={{ width: 28, height: 28 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93A1B8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </IconButton>
      </Stack>
    ),
  },
];

/* ── DataGrid sx — ค่ามาตรฐานจาก Typo & Font Size ── */
const DATAGRID_SX = {
  border: "none",
  "& .MuiDataGrid-columnHeaders": {
    bgcolor: "#F5F5F7",
    fontSize: 13,
    fontWeight: 600,
    color: "#6B7280",
  },
  "& .MuiDataGrid-cell": {
    fontSize: 14,
    fontWeight: 400,
    color: "#1A1A1A",
    display: "flex",
    alignItems: "center",
  },
  "& .MuiDataGrid-row:hover": {
    bgcolor: "rgba(255,107,0,0.04)",
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "1px solid #F5F5F7",
    "& .MuiTablePagination-root": { fontSize: 13, color: "#6B7280" },
    "& .MuiTablePagination-selectLabel": { fontSize: 13, color: "#6B7280" },
    "& .MuiTablePagination-displayedRows": { fontSize: 13, color: "#6B7280" },
  },
  "& .MuiCheckbox-root": {
    color: "#ccc",
    "&.Mui-checked": { color: SA },
  },
};

function PreviewDataListStandard() {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <Box>
      {/* Page Title — 22px / 700 / #1A1A1A */}
      <Typography sx={{ fontSize: 22, fontWeight: 700, py: 2.5, color: "#1A1A1A" }}>
        รายชื่อลูกค้า
      </Typography>

      {/* Sub-tabs — pill style เหมือน Tenant Employee */}
      <Tabs
        value={tabIndex}
        onChange={(_, v) => setTabIndex(v)}
        sx={{
          mb: 2,
          "& .MuiTab-root": {
            textTransform: "none", fontWeight: 500, fontSize: "1rem",
            minHeight: 42, borderRadius: "8px", mr: 1,
          },
          "& .Mui-selected": {
            bgcolor: SA, color: "#fff !important", fontWeight: 600,
          },
          "& .MuiTabs-indicator": { display: "none" },
        }}
      >
        <Tab label="ลูกค้าปัจจุบัน" />
        <Tab label="ลูกค้าที่ยกเลิก" />
        <Tab label="ลูกค้าที่ระงับ" />
      </Tabs>

      {/* Content Card */}
      <Paper elevation={3} sx={{ borderRadius: "10px", overflow: "hidden" }}>
        {/* Filter Bar — เหมือน Tenant Employee */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2.5 }}>
          <Button
            variant="outlined"
            startIcon={<FileUploadOutlinedIcon />}
            sx={{ color: SA, borderColor: SA, "&:hover": { borderColor: "#E65C00", bgcolor: "rgba(255,107,0,0.04)" }, textTransform: "none", whiteSpace: "nowrap", fontSize: 13, fontWeight: 600, height: 36 }}
          >
            ส่งออกรายงาน
          </Button>

          <TextField
            select value="" label="เลือกกลุ่ม" size="small"
            sx={{ minWidth: 180 }} InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="ขายส่ง">ขายส่ง</MenuItem>
            <MenuItem value="ขายปลีก">ขายปลีก</MenuItem>
          </TextField>

          <TextField
            select value="" label="เลือกตำแหน่ง" size="small"
            sx={{ minWidth: 180 }} InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="ผู้จัดการทั่วไป">ผู้จัดการทั่วไป</MenuItem>
            <MenuItem value="CEO">CEO</MenuItem>
          </TextField>

          <Box sx={{ flex: 1 }} />

          <TextField
            size="small" placeholder="ค้นหารหัส, ชื่อลูกค้า"
            sx={{ minWidth: 280, "& .MuiOutlinedInput-root": { height: 40, fontSize: 14 }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E5E7EB" } }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: SA, "&:hover": { bgcolor: "#E65C00" }, textTransform: "none", whiteSpace: "nowrap", fontSize: 13, fontWeight: 600, height: 36 }}
          >
            เพิ่มลูกค้า
          </Button>
        </Stack>

        {/* DataGrid */}
        <DataGrid
          rows={SAMPLE_ROWS}
          columns={DATALIST_COLUMNS}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          checkboxSelection
          disableRowSelectionOnClick
          autoHeight
          getRowHeight={() => 60}
          sx={DATAGRID_SX}
        />
      </Paper>
    </Box>
  );
}

function PreviewMeatballMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuItems = [
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: "ส่ง E-mail ยืนยันซ้ำ", color: "#374151" },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, label: "Reset รหัสผ่าน", color: "#374151" },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, label: "แก้ไขข้อมูล", color: "#374151" },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, label: "ระงับ Account", color: "#FF6B00" },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 500, py: 2.5, color: "#374151" }}>
        Meatball Menu
      </Typography>
      <Typography variant="body2" sx={{ color: "#777", mb: 3 }}>
        Popup เมนูที่แสดงเมื่อกดปุ่ม ⋮ (Meatball) ในคอลัมน์จัดการ — ใช้กับตาราง DataList ทุกหน้า
      </Typography>

      <Stack direction="row" spacing={4} alignItems="flex-start">
        {/* Demo button */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "#999", mb: 1, display: "block" }}>กดเพื่อทดสอบ</Typography>
          <IconButton
            onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
            sx={{ width: 40, height: 40, border: "1px solid #E0E0E0", borderRadius: 2 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93A1B8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </IconButton>
        </Box>

        {/* Static preview card — always visible */}
        <Paper elevation={3} sx={{ borderRadius: "5px", overflow: "hidden", width: 227 }}>
          {menuItems.map((item, i) => (
            <Box
              key={i}
              sx={{
                display: "flex", alignItems: "center", gap: 1.5,
                px: 2, py: 1.5,
                cursor: "pointer",
                "&:hover": { bgcolor: "#F5F5F7" },
                borderBottom: i < menuItems.length - 1 ? "1px solid #F5F5F7" : "none",
              }}
            >
              {item.icon}
              <Typography variant="body2" sx={{ color: item.color, fontSize: "0.875rem" }}>{item.label}</Typography>
            </Box>
          ))}
        </Paper>

        {/* Live popover — shows when button clicked */}
        {anchorEl && (
          <Paper
            elevation={8}
            sx={{
              borderRadius: "5px", overflow: "hidden", width: 227,
              position: "absolute",
              top: anchorEl.getBoundingClientRect().bottom + 8,
              left: anchorEl.getBoundingClientRect().left,
              zIndex: 1000,
            }}
          >
            {menuItems.map((item, i) => (
              <Box
                key={i}
                onClick={() => setAnchorEl(null)}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5,
                  px: 2, py: 1.5,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#F5F5F7" },
                  borderBottom: i < menuItems.length - 1 ? "1px solid #F5F5F7" : "none",
                }}
              >
                {item.icon}
                <Typography variant="body2" sx={{ color: item.color, fontSize: "0.875rem" }}>{item.label}</Typography>
              </Box>
            ))}
          </Paper>
        )}
      </Stack>
    </Box>
  );
}

/* ── Modal header icons ตาม Figma: folder, pin, external-link, close ── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MODAL_HEADER_ICONS = [
  <svg key="folder" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  <svg key="pin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>,
  <svg key="ext" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
];
const MODAL_CLOSE_ICON = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

/* ── Modal TextField sx — spec: H:48px, value 15px, label 15px/12px, border 1.5px #E5E7EB, radius 8px, focus #FF6B00 ── */
const MODAL_TF_SX = {
  "& .MuiOutlinedInput-root": {
    height: 48,
    fontSize: 15,
    fontWeight: 400,
    color: "#1A1A1A",
    borderRadius: "8px",
    "& .MuiOutlinedInput-notchedOutline": {
      borderWidth: "1.5px",
      borderColor: "#E5E7EB",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#E5E7EB",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: "1.5px",
      borderColor: SA,
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: 15,
    fontWeight: 400,
    color: "#6B7280",
    "&.Mui-focused": {
      fontSize: 12,
      fontWeight: 400,
      color: SA,
    },
    "&.MuiInputLabel-shrink": {
      fontSize: 12,
    },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: 15,
    fontWeight: 400,
    color: "#1A1A1A",
    padding: "12px 14px",
    "&::placeholder": { fontSize: 15, fontWeight: 400 },
  },
  "& .MuiFormLabel-asterisk": {
    color: "#EF4444",
    fontWeight: 400,
  },
};

/* ── Modal form body — shared between static preview and live dialog ── */
const SH = { shrink: true }; // InputLabelProps shorthand — CP-INPUT-PLACEHOLDER style

function ModalFormBody() {
  return (
    <Stack spacing="20px">
      <TextField label="ชื่อร้าน / ชื่อบริษัท" required fullWidth placeholder="กรอกชื่อร้าน / ชื่อบริษัท" sx={MODAL_TF_SX} InputLabelProps={SH} />
      <Stack direction="row" spacing="16px">
        <TextField label="คำนำหน้า" required select sx={{ minWidth: 160, ...MODAL_TF_SX }} defaultValue="" InputLabelProps={SH}><MenuItem value="">เลือกคำนำหน้า</MenuItem><MenuItem value="นาย">นาย</MenuItem><MenuItem value="นาง">นาง</MenuItem><MenuItem value="นางสาว">นางสาว</MenuItem></TextField>
        <TextField label="ชื่อ" required fullWidth placeholder="กรอกชื่อ" sx={MODAL_TF_SX} InputLabelProps={SH} />
        <TextField label="นามสกุล" required fullWidth placeholder="กรอกนามสกุล" sx={MODAL_TF_SX} InputLabelProps={SH} />
      </Stack>
      <Stack direction="row" spacing="16px">
        <TextField label="ตำแหน่ง" required fullWidth placeholder="กรอกตำแหน่ง" sx={MODAL_TF_SX} InputLabelProps={SH} />
        <TextField label="กลุ่มลูกค้า" required select fullWidth sx={MODAL_TF_SX} defaultValue="" InputLabelProps={SH}><MenuItem value="">เลือกกลุ่มลูกค้า</MenuItem><MenuItem value="ขายส่ง">ขายส่ง</MenuItem><MenuItem value="ขายปลีก">ขายปลีก</MenuItem></TextField>
      </Stack>
      <Stack direction="row" spacing="16px">
        <TextField label="จำนวนธุรกิจ" required fullWidth defaultValue="3" sx={MODAL_TF_SX} InputLabelProps={SH} />
        <TextField
          label="เบอร์โทรศัพท์" required fullWidth placeholder="กรอกเบอร์โทร"
          sx={MODAL_TF_SX} InputLabelProps={SH}
          InputProps={{ startAdornment: <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1, whiteSpace: "nowrap", fontSize: 15, color: "#374151" }}>🇹🇭 +66</Box> }}
        />
      </Stack>
      <Stack direction="row" spacing="16px" alignItems="flex-start">
        <TextField label="อีเมล" required fullWidth placeholder="กรอกอีเมล" sx={{ flex: 1, ...MODAL_TF_SX }} InputLabelProps={SH} />
        <Box sx={{
          flex: 1, minHeight: 48, display: "flex", alignItems: "center", gap: 1,
          bgcolor: "#FEF3C7", borderRadius: "8px", px: 2, py: 1.5,
          fontSize: 13, fontWeight: 400, color: "#92400E",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          ระบบจะส่ง Email ยืนยันตัวตนให้ผู้ติดต่อทันที
        </Box>
      </Stack>
    </Stack>
  );
}

const PINKEY_SHOWCASE = "modal_pin_showcase";

function PreviewModalSizeM() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const paperRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button") || isFullscreen) return;
    dragging.current = true;
    const paper = paperRef.current;
    if (paper) {
      const rect = paper.getBoundingClientRect();
      offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    e.preventDefault();
  }, [isFullscreen]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y }); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const handleOpen = () => {
    setIsFullscreen(false);
    // Restore pinned position
    const saved = localStorage.getItem(PINKEY_SHOWCASE);
    if (saved) {
      try {
        const { x, y } = JSON.parse(saved);
        const safeX = Math.min(Math.max(0, x), window.innerWidth - 400);
        const safeY = Math.min(Math.max(0, y), window.innerHeight - 200);
        setPos({ x: safeX, y: safeY });
        setIsPinned(true);
      } catch { setPos(null); setIsPinned(false); }
    } else {
      setPos(null);
      setIsPinned(false);
    }
    setOpen(true);
  };

  // Pin: save current position
  const handlePin = () => {
    if (isPinned) {
      localStorage.removeItem(PINKEY_SHOWCASE);
      setIsPinned(false);
    } else if (pos) {
      localStorage.setItem(PINKEY_SHOWCASE, JSON.stringify(pos));
      setIsPinned(true);
    }
  };

  // Expand: toggle fullscreen
  const handleExpand = () => {
    setIsFullscreen(prev => !prev);
    if (!isFullscreen) setPos(null); // reset position when going fullscreen
  };

  // Close with static preview (no dirty check in showcase)
  const handleClose = () => { setOpen(false); };

  const headerBar = (onClose?: () => void, isDraggable?: boolean) => (
    <Box
      onMouseDown={isDraggable ? handleMouseDown : undefined}
      sx={{
        bgcolor: SA, px: 3, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
        ...(isDraggable && !isFullscreen ? { cursor: "move", userSelect: "none" } : { userSelect: "none" }),
      }}
    >
      <Typography sx={{ color: "white", fontWeight: 600, fontSize: 18 }}>เพิ่มลูกค้า</Typography>
      <Stack direction="row" spacing={0.5}>
        {/* Expand */}
        <Tooltip title={isFullscreen ? "ย่อกลับ" : "ขยายเต็มจอ"}>
          <IconButton size="small" sx={{ color: "white" }} onClick={handleExpand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/modal/expand.svg" alt="expand" width={20} height={20} />
          </IconButton>
        </Tooltip>
        {/* Pin */}
        <Tooltip title={isPinned ? "ยกเลิก Pin" : "จำตำแหน่ง"}>
          <IconButton size="small" sx={{ color: "white", opacity: isPinned ? 1 : 0.6 }} onClick={handlePin}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/modal/pin.svg" alt="pin" width={20} height={20} />
          </IconButton>
        </Tooltip>
        {/* Pop out — showcase demo only */}
        <Tooltip title="เปิดหน้าต่างใหม่">
          <IconButton size="small" sx={{ color: "white" }} onClick={() => alert("Pop out: ใช้งานจริงจะเปิด window ใหม่")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/modal/popout.svg" alt="popout" width={20} height={20} />
          </IconButton>
        </Tooltip>
        {/* Close */}
        <IconButton size="small" sx={{ color: "white" }} onClick={onClose}>{MODAL_CLOSE_ICON}</IconButton>
      </Stack>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 500, py: 2.5, color: "#374151" }}>
        Modal Size M
      </Typography>
      <Typography variant="body2" sx={{ color: "#777", mb: 3 }}>
        MUI Dialog 820×507 — Header ส้ม + 4 ปุ่ม (Expand / Pin / Pop out / Close) + Drag + Resize + Form
      </Typography>

      <Button variant="contained" onClick={handleOpen} sx={{ bgcolor: SA, "&:hover": { bgcolor: "#E65C00" }, textTransform: "none" }}>
        เปิด Modal ทดสอบ
      </Button>

      {/* Static preview */}
      <Paper elevation={3} sx={{ mt: 3, borderRadius: "8px", overflow: "hidden", maxWidth: 820 }}>
        {headerBar()}
        <Box sx={{ p: "28px" }}><ModalFormBody /></Box>
        <Box sx={{ px: "28px", py: 2, display: "flex", justifyContent: "flex-end", gap: 1.5, borderTop: "1px solid #F0F0F0" }}>
          <Button variant="outlined" sx={{ textTransform: "none", fontSize: 14, fontWeight: 600, height: 40, color: SA, borderColor: SA, "&:hover": { borderColor: "#CC5500", color: "#CC5500", bgcolor: "rgba(255,107,0,0.04)" } }}>ยกเลิก</Button>
          <Button variant="contained" sx={{ bgcolor: SA, "&:hover": { bgcolor: "#CC5500" }, textTransform: "none", fontSize: 14, fontWeight: 600, height: 40 }}>บันทึก</Button>
        </Box>
      </Paper>

      {/* Live Dialog — resizable + draggable + fullscreen */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        fullScreen={isFullscreen}
        PaperProps={{
          ref: paperRef,
          sx: {
            ...(!isFullscreen ? {
              width: 820, minHeight: 507, borderRadius: "8px", overflow: "hidden",
              resize: "both", minWidth: 400, maxWidth: "95vw", maxHeight: "95vh",
              ...(pos ? { position: "fixed", left: pos.x, top: pos.y, margin: 0 } : {}),
            } : {
              borderRadius: 0, overflow: "hidden",
            }),
          },
        }}
      >
        {headerBar(handleClose, true)}
        <DialogContent sx={{ p: "28px", pt: "28px !important" }}><ModalFormBody /></DialogContent>
        <DialogActions sx={{ px: "28px", py: 2, borderTop: "1px solid #F0F0F0" }}>
          <Button variant="outlined" onClick={handleClose} sx={{ textTransform: "none", fontSize: 14, fontWeight: 600, height: 40, color: SA, borderColor: SA, "&:hover": { borderColor: "#CC5500", color: "#CC5500", bgcolor: "rgba(255,107,0,0.04)" } }}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleClose} sx={{ bgcolor: SA, "&:hover": { bgcolor: "#CC5500" }, textTransform: "none", fontSize: 14, fontWeight: 600, height: 40 }}>บันทึก</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function PreviewQuotation() {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>ใบเสนอราคา</Typography>
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: "0px 2px 10px rgba(76,78,100,0.15)" }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#FF6B00" }}>JIGSAW ERP</Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>ใบเสนอราคา / Quotation</Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>เลขที่: QT-2026-0001</Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>วันที่: 04/04/2026</Typography>
          </Box>
        </Stack>
        <Table size="small" sx={{ mb: 3 }}>
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 600, bgcolor: "#F5F5F7" } }}>
              <TableCell>#</TableCell>
              <TableCell>รายการ</TableCell>
              <TableCell align="right">จำนวน</TableCell>
              <TableCell align="right">ราคาต่อหน่วย</TableCell>
              <TableCell align="right">รวม</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow><TableCell>1</TableCell><TableCell>กาแฟคั่วเข้ม 500g</TableCell><TableCell align="right">10</TableCell><TableCell align="right">350.00</TableCell><TableCell align="right">3,500.00</TableCell></TableRow>
            <TableRow><TableCell>2</TableCell><TableCell>แก้วกระดาษ 16oz (50 ใบ)</TableCell><TableCell align="right">5</TableCell><TableCell align="right">180.00</TableCell><TableCell align="right">900.00</TableCell></TableRow>
          </TableBody>
        </Table>
        <Stack direction="row" justifyContent="flex-end">
          <Box sx={{ width: 200, textAlign: "right" }}>
            <Typography variant="body2">รวม: 4,400.00</Typography>
            <Typography variant="body2">VAT 7%: 308.00</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#FF6B00", mt: 1 }}>รวมทั้งสิ้น: 4,708.00</Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

/* ── Preview: Confirm Modal (แสดง inline + กดเล่นได้) ── */
function PreviewConfirmModal() {
  const [result, setResult] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <Box>
      <Typography sx={{ fontSize: 18, fontWeight: 700, color: SA, mb: 2 }}>Confirm Modal</Typography>
      <Typography sx={{ fontSize: 14, color: "#6B7280", mb: 3 }}>Modal ยืนยันการกระทำ — แถบสีบนสุด + ข้อความกลาง + ปุ่ม ไม่ใช่/ใช่</Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" onClick={() => setDialogOpen(true)} sx={{ bgcolor: SA, textTransform: "none", borderRadius: "8px", "&:hover": { bgcolor: "#E65C00" } }}>
          เปิด Confirm Modal (Dialog)
        </Button>
      </Stack>

      {result && (
        <Paper sx={{ p: 2, bgcolor: result === "confirmed" ? "#EEFBE5" : "#FEF2F2", borderRadius: 2, mb: 3 }}>
          <Typography sx={{ fontSize: 14, color: result === "confirmed" ? "#3B6D11" : "#B91C1C" }}>
            ผลลัพธ์: {result === "confirmed" ? "✅ ยืนยันแล้ว" : "❌ ยกเลิก"}
          </Typography>
        </Paper>
      )}

      {/* ── Inline Preview (แสดงขึ้นมาเลย เหมือน Modal Size M) ── */}
      <Paper sx={{ maxWidth: 460, mx: "auto", borderRadius: "10px", overflow: "hidden", boxShadow: "0px 0px 20px rgba(76,78,100,0.2)", mb: 4 }}>
        <Box sx={{ height: 50, bgcolor: SA }} />
        <Box sx={{ position: "relative" }}>
          <IconButton sx={{ position: "absolute", top: 8, right: 8, color: "#6B7280" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </IconButton>
          <Box sx={{ px: 4, pt: 4, pb: 3, textAlign: "center" }}>
            <Typography sx={{ fontSize: 22, fontWeight: 500, color: "#374151", lineHeight: 1.7 }}>
              คุณต้องการ<br />
              <Box component="span" sx={{ color: SA, fontWeight: 700 }}>&ldquo;ปิดการใช้งาน&rdquo;</Box>
              {" "}ใช่หรือไม่
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, pb: 3 }}>
            <Button variant="outlined" onClick={() => setResult("cancelled")} sx={{ textTransform: "none", fontSize: 15, color: "#4C4E63", borderColor: "#B8B8C2", borderRadius: "8px", px: 3, height: 40 }}>ไม่ใช่</Button>
            <Button variant="contained" onClick={() => setResult("confirmed")} sx={{ textTransform: "none", fontSize: 15, bgcolor: SA, borderRadius: "8px", px: 3, height: 40, "&:hover": { bgcolor: "#E65C00" } }}>ใช่</Button>
          </Box>
        </Box>
      </Paper>

      {/* Spec */}
      <Paper sx={{ p: 2.5, bgcolor: "#F9FAFB", borderRadius: 2, border: "1px solid #E5E7EB" }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#374151", mb: 1 }}>Component Usage:</Typography>
        <Typography sx={{ fontSize: 12, fontFamily: "monospace", color: "#6B7280", whiteSpace: "pre-wrap" }}>
{`import ConfirmModal from "@/components/ui/ConfirmModal";

<ConfirmModal
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={handleConfirm}
  actionText="ปิดการใช้งาน"
  // Optional:
  prefixText="คุณต้องการ"
  suffixText="ใช่หรือไม่"
  confirmLabel="ใช่"
  cancelLabel="ไม่ใช่"
  color="#FF6B00"
/>`}
        </Typography>
      </Paper>

      {/* Dialog version (เปิดจากปุ่ม) */}
      <Dialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setResult("cancelled"); }}
        PaperProps={{ sx: { borderRadius: "10px", overflow: "hidden", minWidth: 420, maxWidth: 460, boxShadow: "0px 0px 20px rgba(76,78,100,0.2)" } }}
      >
        <Box sx={{ height: 50, bgcolor: SA }} />
        <IconButton onClick={() => { setDialogOpen(false); setResult("cancelled"); }} sx={{ position: "absolute", top: 60, right: 12, color: "#6B7280" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </IconButton>
        <Box sx={{ px: 4, pt: 4, pb: 3, textAlign: "center" }}>
          <Typography sx={{ fontSize: 22, fontWeight: 500, color: "#374151", lineHeight: 1.7 }}>
            คุณต้องการ<br />
            <Box component="span" sx={{ color: SA, fontWeight: 700 }}>&ldquo;ปิดการใช้งาน&rdquo;</Box>
            {" "}ใช่หรือไม่
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, pb: 3 }}>
          <Button variant="outlined" onClick={() => { setDialogOpen(false); setResult("cancelled"); }} sx={{ textTransform: "none", fontSize: 15, color: "#4C4E63", borderColor: "#B8B8C2", borderRadius: "8px", px: 3, height: 40 }}>ไม่ใช่</Button>
          <Button variant="contained" onClick={() => { setDialogOpen(false); setResult("confirmed"); }} sx={{ textTransform: "none", fontSize: 15, bgcolor: SA, borderRadius: "8px", px: 3, height: 40, "&:hover": { bgcolor: "#E65C00" } }}>ใช่</Button>
        </Box>
      </Dialog>
    </Box>
  );
}

/* ── Preview: Form with Tab 1 ── */
function PreviewFormWithTab1() {
  const [tab, setTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ id: "MA-69-03-0001", company: "โรงคั่วกาแฟพะเยา", group: "ขายส่ง", quota: "3", title: "นางสาว", firstName: "น้ำทิพย์", lastName: "บัวพิทักษ์", position: "ผู้จัดการ", email: "namtip@gmail.com", phone: "0661541519" });

  const VIEW_SX = { "& .MuiOutlinedInput-root": { bgcolor: "#F8F8F9", borderRadius: "8px", fontSize: 15, "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(76,78,100,0.22)" } }, "& .MuiInputLabel-root": { fontSize: 14, color: "#6B7280" }, "& .MuiFormLabel-asterisk": { color: "#FF4D49" } };
  const EDIT_SX = { "& .MuiOutlinedInput-root": { bgcolor: "#FFF", borderRadius: "8px", fontSize: 15, "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(76,78,100,0.22)" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: SA }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: SA, borderWidth: "1.5px" } }, "& .MuiInputLabel-root": { fontSize: 14, color: "#6B7280", "&.Mui-focused": { color: SA } }, "& .MuiFormLabel-asterisk": { color: "#FF4D49" } };
  const sx = isEditing ? EDIT_SX : VIEW_SX;
  const ro = !isEditing;

  return (
    <Box>
      <Typography sx={{ fontSize: 18, fontWeight: 700, color: SA, mb: 1 }}>Form with Tab 1</Typography>
      <Typography sx={{ fontSize: 14, color: "#6B7280", mb: 3 }}>Form + Tabs + View/Edit Mode สลับได้ — กดแก้ไขเพื่อเปิดแก้ fields</Typography>

      {/* Mode indicator */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip label={isEditing ? "Edit Mode" : "View Mode"} size="small" sx={{ fontWeight: 600, fontSize: 12, bgcolor: isEditing ? "#FFF7ED" : "#F3F4F6", color: isEditing ? SA : "#6B7280" }} />
      </Stack>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: "0.9rem", minHeight: 38, borderRadius: "8px", mr: 0.5, px: 2 }, "& .Mui-selected": { bgcolor: SA, color: "#fff !important", fontWeight: 600 }, "& .MuiTabs-indicator": { display: "none" } }}>
        <Tab label="ข้อมูลทั่วไป" />
        <Tab label="ข้อมูลธุรกิจ (0/3)" />
        <Tab label="ประวัติ" />
      </Tabs>

      {tab === 0 && (
        <Paper sx={{ borderRadius: "10px", p: 3, boxShadow: "0px 2px 10px rgba(76,78,100,0.12)" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: SA, mb: 2.5 }}>ข้อมูลทั่วไป</Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField label="รหัส Account *" value={form.id} fullWidth InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} sx={VIEW_SX} />
            <TextField label="ชื่อร้าน / ชื่อบริษัท *" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} fullWidth InputProps={{ readOnly: ro }} InputLabelProps={{ shrink: true }} sx={sx} />
            <TextField label="กลุ่มลูกค้า *" value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} fullWidth InputProps={{ readOnly: ro }} InputLabelProps={{ shrink: true }} sx={sx} />
            <TextField label="จำนวนธุรกิจ *" value={form.quota} onChange={(e) => setForm({ ...form, quota: e.target.value })} fullWidth InputProps={{ readOnly: ro }} InputLabelProps={{ shrink: true }} sx={sx} />
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField label="คำนำหน้า *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} fullWidth InputProps={{ readOnly: ro }} InputLabelProps={{ shrink: true }} sx={sx} />
            <TextField label="ชื่อ *" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} fullWidth InputProps={{ readOnly: ro }} InputLabelProps={{ shrink: true }} sx={sx} />
            <TextField label="นามสกุล *" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} fullWidth InputProps={{ readOnly: ro }} InputLabelProps={{ shrink: true }} sx={sx} />
            <TextField label="ตำแหน่ง" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} fullWidth InputProps={{ readOnly: ro }} InputLabelProps={{ shrink: true }} sx={sx} />
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <TextField label="อีเมล" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth InputProps={{ readOnly: ro }} InputLabelProps={{ shrink: true }} sx={sx} />
            <TextField label="เบอร์โทรศัพท์" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} fullWidth InputProps={{ readOnly: ro }} InputLabelProps={{ shrink: true }} sx={sx} />
            <TextField label="วันที่ลงทะเบียน" value="12/02/2026 - Admin" fullWidth InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} sx={VIEW_SX} />
            <TextField label="วันที่แก้ไขล่าสุด" value="12/02/2026 - Admin" fullWidth InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} sx={VIEW_SX} />
          </Stack>

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button variant="outlined" onClick={() => setIsEditing(false)} sx={{ textTransform: "none", fontSize: 15, color: "#374151", borderColor: "rgba(76,78,100,0.22)", borderRadius: "8px", height: 42, px: 3 }}>ยกเลิก</Button>
            <Button variant="contained" onClick={() => setIsEditing(!isEditing)} sx={{ textTransform: "none", fontSize: 15, bgcolor: SA, borderRadius: "8px", height: 42, px: 3, "&:hover": { bgcolor: "#E65C00" } }}>
              {isEditing ? "บันทึก" : "แก้ไข"}
            </Button>
          </Stack>
        </Paper>
      )}

      {tab !== 0 && (
        <Paper sx={{ borderRadius: "10px", p: 3, boxShadow: "0px 2px 10px rgba(76,78,100,0.12)" }}>
          <Typography sx={{ fontSize: 15, color: "#9CA3AF" }}>Tab content placeholder</Typography>
        </Paper>
      )}
    </Box>
  );
}

function PreviewPlaceholder({ title }: { title: string }) {
  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#999", mb: 1 }}>{title}</Typography>
      <Typography variant="body2" sx={{ color: "#bbb" }}>Template preview กำลังพัฒนา</Typography>
    </Box>
  );
}

/* ══════════════════════════════════════════════════
   Main Page
   ══════════════════════════════════════════════════ */
export default function TemplatePage() {
  const router = useRouter();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ datalist: true, interaction: true, document: true, form: false, dashboard: false });
  const [selectedTemplate, setSelectedTemplate] = useState<string>("datalist-standard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderPreview = () => {
    switch (selectedTemplate) {
      case "datalist-standard": return <PreviewDataListStandard />;
      case "meatball-menu": return <PreviewMeatballMenu />;
      case "modal-size-m": return <PreviewModalSizeM />;
      case "confirm-modal": return <PreviewConfirmModal />;
      case "form-with-tab-1": return <PreviewFormWithTab1 />;
      case "quotation": return <PreviewQuotation />;
      default: {
        const allItems = TEMPLATE_CATEGORIES.flatMap(c => c.items);
        const item = allItems.find(i => i.id === selectedTemplate);
        return <PreviewPlaceholder title={item?.label || selectedTemplate} />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F9] flex">
      {/* Left: Template Sidebar — collapsible */}
      <div
        className="bg-white border-r border-gray-200 flex flex-col shrink-0 h-screen sticky top-0 transition-all duration-300 overflow-hidden"
        style={{ width: sidebarOpen ? 280 : 0 }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-start justify-between" style={{ minWidth: 280 }}>
          <div>
            <Button startIcon={<ArrowBackIcon />} size="small" onClick={() => router.push("/component-showcase")} sx={{ color: "#999", textTransform: "none", mb: 1 }}>
              กลับ Component Showcase
            </Button>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#FF6B00" }}>Template</Typography>
            <Typography variant="caption" sx={{ color: "#999" }}>เลือก template เพื่อดูตัวอย่าง</Typography>
          </div>
          <IconButton size="small" onClick={() => setSidebarOpen(false)} sx={{ mt: 0.5 }}>
            <ChevronLeftIcon />
          </IconButton>
        </div>

        {/* Category List */}
        <div className="flex-1 overflow-y-auto py-2" style={{ fontFamily: "'Sarabun', sans-serif", minWidth: 280 }}>
          {TEMPLATE_CATEGORIES.map((cat) => (
            <div key={cat.id} className="mb-1">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                style={{ fontSize: 15, fontWeight: 500 }}
              >
                <span style={{ color: "#777" }}>{cat.icon}</span>
                <span className="flex-1 text-left">{cat.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${expandedCategories[cat.id] ? "rotate-180" : ""}`}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Sub-items */}
              {expandedCategories[cat.id] && (
                <div className="ml-4 border-l-2 border-gray-100">
                  {cat.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedTemplate(item.id)}
                      className={`w-full text-left px-4 py-2 transition-colors ${
                        selectedTemplate === item.id
                          ? "text-[#FF6B00] font-semibold border-l-2 border-[#FF6B00] -ml-[2px] bg-[#FF6B00]/5"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                      style={{ fontSize: 14 }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right: Preview Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Template Info Bar */}
        <Paper sx={{ px: 3, py: 2, mb: 3, borderRadius: 2, display: "flex", alignItems: "center", gap: 2, boxShadow: "0px 1px 4px rgba(0,0,0,0.08)" }}>
          {!sidebarOpen && (
            <IconButton size="small" onClick={() => setSidebarOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Tooltip title={copied ? "Copied!" : "คลิกเพื่อคัดลอก"} arrow>
                <Box
                  onClick={() => {
                    const code = `TPL-${(selectedTemplate || "").toUpperCase()}`;
                    navigator.clipboard.writeText(code);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  sx={{
                    display: "inline-flex", alignItems: "center", gap: 0.75,
                    bgcolor: copied ? "rgba(238,251,229,0.98)" : "#F5F5F7",
                    color: copied ? "#3B6D11" : "#374151",
                    fontWeight: 600, fontSize: 12, fontFamily: "monospace",
                    px: 1.5, py: 0.5, borderRadius: "16px",
                    cursor: "pointer", transition: "all 0.2s",
                    "&:hover": { bgcolor: copied ? "rgba(238,251,229,0.98)" : "#EBEBEB" },
                  }}
                >
                  {copied ? "✓ Copied!" : `TPL-${(selectedTemplate || "").toUpperCase()}`}
                  {!copied && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  )}
                </Box>
              </Tooltip>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {TEMPLATE_CATEGORIES.flatMap(c => c.items).find(i => i.id === selectedTemplate)?.label || "Template"}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: "#999" }}>
              {TEMPLATE_CATEGORIES.flatMap(c => c.items).find(i => i.id === selectedTemplate)?.description || ""}
            </Typography>
          </Box>
          <Chip label="MUI X DataGrid" size="small" variant="outlined" sx={{ fontSize: 11, fontWeight: 500, mr: 1 }} />
          <Chip label="Preview" size="small" sx={{ bgcolor: "#FF6B00", color: "white", fontSize: 11 }} />
        </Paper>

        {/* Preview Content — same layout as Tenant page (Box with bg, px/py) */}
        <Box sx={{ bgcolor: "#F7F7F9", borderRadius: 2, px: 3, py: 3, minHeight: 400 }}>
          {renderPreview()}
        </Box>
      </div>
    </div>
  );
}
