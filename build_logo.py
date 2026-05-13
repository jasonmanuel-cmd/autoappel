from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

FONTS = r"C:\Users\blunt\AppData\Roaming\Claude\local-agent-mode-sessions\skills-plugin\6d4baf15-8db0-4947-96e7-2021fdd02f1a\0f8b657e-2e03-4ed8-af66-79703fdfb8ec\skills\canvas-design\canvas-fonts"

W, H = 1600, 900
BG      = (8, 8, 12)
DARK    = (14, 14, 20)
ACID    = (0, 255, 136)       # electric mint-green
ACID2   = (0, 200, 100)
WHITE   = (240, 242, 246)
GREY    = (80, 85, 95)
DGREY   = (28, 32, 40)

img = Image.new("RGB", (W, H), BG)
d   = ImageDraw.Draw(img)

# ── subtle grid texture ──────────────────────────────────────────────────────
for x in range(0, W, 40):
    d.line([(x, 0), (x, H)], fill=(18, 20, 26), width=1)
for y in range(0, H, 40):
    d.line([(0, y), (W, y)], fill=(18, 20, 26), width=1)

# ── document slab (center-left) ─────────────────────────────────────────────
doc_x, doc_y = 140, 190
doc_w, doc_h = 320, 420
doc_r = 6

d.rounded_rectangle(
    [doc_x - 4, doc_y - 4, doc_x + doc_w + 4, doc_y + doc_h + 4],
    radius=doc_r + 2, fill=(20, 22, 30)
)
d.rounded_rectangle(
    [doc_x, doc_y, doc_x + doc_w, doc_y + doc_h],
    radius=doc_r, fill=(22, 25, 34)
)

# document lines (redacted-record texture)
line_colors = [
    (38, 42, 54), (38, 42, 54), (38, 42, 54),
    (38, 42, 54), (38, 42, 54), (38, 42, 54),
    (34, 38, 50), (38, 42, 54), (38, 42, 54),
]
for i, lc in enumerate(line_colors):
    lx = doc_x + 24
    ly = doc_y + 52 + i * 40
    lw = [200, 180, 220, 140, 200, 160, 200, 180, 120][i]
    d.rounded_rectangle([lx, ly, lx + lw, ly + 10], radius=3, fill=lc)

# top-right fold corner
fold = 22
pts = [
    (doc_x + doc_w - fold, doc_y),
    (doc_x + doc_w,        doc_y),
    (doc_x + doc_w,        doc_y + fold),
]
d.polygon(pts, fill=(30, 34, 44))
d.line([(doc_x + doc_w - fold, doc_y), (doc_x + doc_w, doc_y + fold)],
       fill=(50, 55, 68), width=1)

# ── ACID strike-through X over document ─────────────────────────────────────
cx = doc_x + doc_w // 2
cy = doc_y + doc_h // 2
strike_half = 175

# glow layers
for gw, ga in [(28, 18), (18, 32), (10, 60), (4, 140), (2, 255)]:
    gc = (0, int(255 * ga / 255), int(136 * ga / 255))
    d.line([(cx - strike_half, cy - strike_half),
            (cx + strike_half, cy + strike_half)], fill=gc, width=gw)
    d.line([(cx + strike_half, cy - strike_half),
            (cx - strike_half, cy + strike_half)], fill=gc, width=gw)

# ── glow pool behind mark ────────────────────────────────────────────────────
glow = Image.new("RGB", (W, H), (0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse([cx - 180, cy - 180, cx + 180, cy + 180], fill=(0, 80, 40))
glow = glow.filter(ImageFilter.GaussianBlur(60))
img = Image.blend(img, glow, 0.35)
d = ImageDraw.Draw(img)

# redraw strike crisp after blend
for gw, ga in [(28, 18), (18, 32), (10, 60), (4, 140), (2, 255)]:
    gc = (0, int(255 * ga / 255), int(136 * ga / 255))
    d.line([(cx - strike_half, cy - strike_half),
            (cx + strike_half, cy + strike_half)], fill=gc, width=gw)
    d.line([(cx + strike_half, cy - strike_half),
            (cx - strike_half, cy + strike_half)], fill=gc, width=gw)

# ── thin vertical rule separating mark from wordmark ────────────────────────
rule_x = 520
d.line([(rule_x, 220), (rule_x, H - 220)], fill=(40, 45, 56), width=1)

# ── WORDMARK: EXPUNGE ────────────────────────────────────────────────────────
try:
    font_word = ImageFont.truetype(os.path.join(FONTS, "BigShoulders-Bold.ttf"), 148)
except Exception:
    font_word = ImageFont.load_default()

try:
    font_tag  = ImageFont.truetype(os.path.join(FONTS, "DMMono-Regular.ttf"), 22)
except Exception:
    font_tag  = ImageFont.load_default()

try:
    font_sub  = ImageFont.truetype(os.path.join(FONTS, "WorkSans-Regular.ttf"), 26)
except Exception:
    font_sub  = ImageFont.load_default()

try:
    font_sub_b = ImageFont.truetype(os.path.join(FONTS, "WorkSans-Bold.ttf"), 26)
except Exception:
    font_sub_b = font_sub

word = "EXPUNGE"
# measure
bb = d.textbbox((0, 0), word, font=font_word)
tw = bb[2] - bb[0]
th = bb[3] - bb[1]

word_x = rule_x + 60
word_y = H // 2 - th // 2 - 30

# subtle text shadow / glow
for ox, oy in [(-3, 3), (3, 3), (-3, -3), (3, -3)]:
    d.text((word_x + ox, word_y + oy), word, font=font_word, fill=(0, 60, 30))

# main wordmark — white
d.text((word_x, word_y), word, font=font_word, fill=WHITE)

# strike-through the wordmark (the defining gesture)
strike_y = word_y + th // 2 + 8
strike_x2 = word_x + tw

# glow
for sw, sa in [(20, 20), (12, 50), (6, 120), (3, 255)]:
    sc = (0, int(255 * sa / 255), int(136 * sa / 255))
    d.line([(word_x - 8, strike_y), (strike_x2 + 8, strike_y)], fill=sc, width=sw)

# ── tagline ──────────────────────────────────────────────────────────────────
tag = "AI CREDIT DISPUTE AUTOMATION"
tag_bb = d.textbbox((0, 0), tag, font=font_tag)
d.text((word_x, word_y + th + 28), tag, font=font_tag, fill=(90, 100, 115))

# ── small legal-style descriptor block ──────────────────────────────────────
# tiny case-number style text, top-right area — institutional texture
try:
    font_micro = ImageFont.truetype(os.path.join(FONTS, "DMMono-Regular.ttf"), 14)
except Exception:
    font_micro = ImageFont.load_default()

micro_lines = [
    "FCRA §611 · §623 · §605",
    "EQUIFAX · EXPERIAN · TRANSUNION",
    "DISPUTE ENGINE v2.0",
]
for i, ml in enumerate(micro_lines):
    d.text((W - 340, 52 + i * 22), ml, font=font_micro, fill=(36, 42, 52))

# ── bottom rule + legal whisper ──────────────────────────────────────────────
d.line([(140, H - 80), (W - 140, H - 80)], fill=(28, 32, 40), width=1)

try:
    font_footer = ImageFont.truetype(os.path.join(FONTS, "DMMono-Regular.ttf"), 13)
except Exception:
    font_footer = ImageFont.load_default()

footer_left  = "EXPUNGE.AI"
footer_right = "DISPUTES FILED. RECORDS ERASED. CREDIT RESTORED."

d.text((140, H - 58), footer_left,  font=font_footer, fill=(0, 180, 90))
fr_bb = d.textbbox((0, 0), footer_right, font=font_footer)
d.text((W - 140 - (fr_bb[2] - fr_bb[0]), H - 58),
       footer_right, font=font_footer, fill=(44, 50, 62))

# ── ACID dot accent on strike endpoint ──────────────────────────────────────
for r, a in [(14, 60), (9, 140), (5, 255)]:
    ac = (0, int(255 * a / 255), int(136 * a / 255))
    d.ellipse([cx - strike_half - r, cy - strike_half - r,
               cx - strike_half + r, cy - strike_half + r], fill=ac)
    d.ellipse([cx + strike_half - r, cy + strike_half - r,
               cx + strike_half + r, cy + strike_half + r], fill=ac)
    d.ellipse([cx + strike_half - r, cy - strike_half - r,
               cx + strike_half + r, cy - strike_half + r], fill=ac)
    d.ellipse([cx - strike_half - r, cy + strike_half - r,
               cx - strike_half + r, cy + strike_half + r], fill=ac)

# ── tight crop version (square logo mark only) ───────────────────────────────
mark_size = 520
mark_pad  = 60
mark_img  = Image.new("RGB", (mark_size, mark_size), BG)
md = ImageDraw.Draw(mark_img)

# grid
for x in range(0, mark_size, 40):
    md.line([(x, 0), (x, mark_size)], fill=(18, 20, 26), width=1)
for y in range(0, mark_size, 40):
    md.line([(0, y), (mark_size, y)], fill=(18, 20, 26), width=1)

# doc slab
mx, my = mark_pad + 10, mark_pad + 10
mw, mh = mark_size - 2 * (mark_pad + 10), mark_size - 2 * (mark_pad + 10)
md.rounded_rectangle([mx, my, mx + mw, my + mh], radius=8, fill=(22, 25, 34))
# doc lines
for i in range(8):
    llen = [160, 140, 170, 110, 160, 120, 160, 100][i]
    lx, ly = mx + 24, my + 42 + i * 38
    md.rounded_rectangle([lx, ly, lx + llen, ly + 9], radius=3, fill=(38, 42, 54))

mcx = mark_size // 2
mcy = mark_size // 2
mhalf = 165

# glow
mglow = Image.new("RGB", (mark_size, mark_size), (0, 0, 0))
mgd   = ImageDraw.Draw(mglow)
mgd.ellipse([mcx - 160, mcy - 160, mcx + 160, mcy + 160], fill=(0, 80, 40))
mglow = mglow.filter(ImageFilter.GaussianBlur(55))
mark_img = Image.blend(mark_img, mglow, 0.4)
md = ImageDraw.Draw(mark_img)

# redraw lines
for i in range(8):
    llen = [160, 140, 170, 110, 160, 120, 160, 100][i]
    lx, ly = mx + 24, my + 42 + i * 38
    md.rounded_rectangle([lx, ly, lx + llen, ly + 9], radius=3, fill=(38, 42, 54))

# X strike
for gw, ga in [(30, 15), (20, 30), (12, 65), (5, 150), (2, 255)]:
    gc = (0, int(255 * ga / 255), int(136 * ga / 255))
    md.line([(mcx - mhalf, mcy - mhalf), (mcx + mhalf, mcy + mhalf)], fill=gc, width=gw)
    md.line([(mcx + mhalf, mcy - mhalf), (mcx - mhalf, mcy + mhalf)], fill=gc, width=gw)

# corner dots
for r, a in [(12, 60), (7, 160), (4, 255)]:
    ac = (0, int(255 * a / 255), int(136 * a / 255))
    for px, py in [(mcx - mhalf, mcy - mhalf), (mcx + mhalf, mcy + mhalf),
                   (mcx + mhalf, mcy - mhalf), (mcx - mhalf, mcy + mhalf)]:
        md.ellipse([px - r, py - r, px + r, py + r], fill=ac)

out_dir = r"C:\Users\blunt\Desktop\apps\Clearpath"
img.save(os.path.join(out_dir, "expunge-logo-full.png"), "PNG", dpi=(300, 300))
mark_img.save(os.path.join(out_dir, "expunge-logo-mark.png"), "PNG", dpi=(300, 300))

print("Saved: expunge-logo-full.png + expunge-logo-mark.png")
