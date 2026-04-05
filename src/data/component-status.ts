/* ── Component Showcase — Approval Status ──
   "approved" = ตรงกับ Figma / User confirmed
   "waiting"  = AI-generated, รอ Design Review
   อัพเดทได้ง่าย: เปลี่ยน "waiting" → "approved" เมื่อ User confirm
*/

export type ApprovalStatus = "approved" | "waiting";

/* ── Main Component Showcase (page.tsx) ── */
export const COMPONENT_STATUS: Record<string, ApprovalStatus> = {
  typo: "waiting",
  buttons: "waiting",
  inputs: "waiting",
  selects: "waiting",
  switches: "waiting",
  forms: "waiting",
  tables: "waiting",
  cards: "waiting",
  lists: "waiting",
  chips: "waiting",
  avatars: "waiting",
  dialogs: "waiting",
  feedback: "waiting",
  progress: "waiting",
  navigation: "waiting",
  timeline: "waiting",
  speeddial: "waiting",
  layout: "waiting",
};

/* ── Icon Showcase (icon/page.tsx) ── */
export const ICON_STATUS: Record<string, ApprovalStatus> = {
  "Main Menu Icons": "approved",
  "Action Icons": "approved",
  "Status Icons": "approved",
  "Navigation Icons": "approved",
  "Data Icons": "approved",
  "Commerce Icons": "approved",
};

/* ── Template Showcase (template/page.tsx) ── */
export const TEMPLATE_STATUS: Record<string, ApprovalStatus> = {
  "datalist-standard": "waiting",
  "product-list": "waiting",
  "employee-list": "waiting",
  "meatball-menu": "waiting",
  "modal-size-m": "waiting",
  "confirm-modal": "approved",       // ← ตาม Figma ✓
  "quotation": "waiting",
  "invoice": "waiting",
  "receipt": "waiting",
  "create-account": "waiting",
  "create-tenant": "waiting",
  "form-with-tab-1": "waiting",
  "overview": "waiting",
};
