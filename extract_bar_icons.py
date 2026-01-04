import re
import os

svg_light = 'ui/最新-default.svg'
svg_dark = 'ui/最新-dark.svg'
output_dir = 'moti-miniprogram/images/icons'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def extract_path(content, signature):
    match = re.search(signature, content, re.DOTALL)
    if match:
        return match.group(1)
    return None

def get_bbox(d):
    coords = [float(x) for x in re.findall(r'-?\d*\.?\d+', d)]
    if not coords: return 0, 0, 0, 0
    xs = coords[0::2]
    ys = coords[1::2]
    return min(xs), min(ys), max(xs), max(ys)

def save_icon(name, d, color, is_stroke=False):
    min_x, min_y, max_x, max_y = get_bbox(d)
    width = max_x - min_x
    height = max_y - min_y
    pad = 2
    
    vb_w = width + 2*pad
    vb_h = height + 2*pad
    
    # Translate path to 0,0
    # Ideally we'd parse and shift, but for simple viewing we can just use viewBox
    # to frame it tightly.
    vb_x = min_x - pad
    vb_y = min_y - pad
    
    fill_attr = f'fill="{color}"' if not is_stroke else 'fill="none"'
    stroke_attr = f'stroke="{color}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"' if is_stroke else ''
    
    svg_content = f'''<svg width="{vb_w}" height="{vb_h}" viewBox="{vb_x} {vb_y} {vb_w} {vb_h}" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="{d}" {fill_attr} {stroke_attr}/>
</svg>'''
    
    with open(os.path.join(output_dir, name), 'w') as f:
        f.write(svg_content)
    print(f"Saved {name}")

# Read Light SVG
with open(svg_light, 'r') as f:
    content_light = f.read()

# Read Dark SVG
with open(svg_dark, 'r') as f:
    content_dark = f.read()

# 1. Search Icon (Stroke)
# Signature: M41 129L38.1047
search_d_sig = r'd="(M41 129L38\.1047.*?)"'
search_d = extract_path(content_light, search_d_sig)
if search_d:
    save_icon('search-bar-icon.svg', search_d, '#B9BABB', is_stroke=True)
    save_icon('search-bar-icon-dark.svg', search_d, '#8E8E8E', is_stroke=True)

# 2. Message Icon (Fill)
# Signature: M350.2 129.866
msg_d_sig = r'd="(M350\.2 129\.866.*?)"'
msg_d = extract_path(content_light, msg_d_sig)
if msg_d:
    save_icon('message-bar-icon.svg', msg_d, '#1F1F1F')
    save_icon('message-bar-icon-dark.svg', msg_d, '#E7E7E7')

