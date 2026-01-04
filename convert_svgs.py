import os

ui_dir = '/Users/changpengcheng/MT/ui'

wxml_template = """<view class="container">
  <image src="./{filename}" mode="widthFix" class="design-reference"></image>
</view>"""

wxss_template = """.container {
  width: 100%;
  min-height: 100vh;
  background-color: #F3F4F6;
}
.design-reference {
  width: 100%;
  display: block;
}"""

count = 0
for filename in os.listdir(ui_dir):
    if filename.endswith('.svg'):
        base_name = os.path.splitext(filename)[0]
        wxml_path = os.path.join(ui_dir, base_name + '.wxml')
        wxss_path = os.path.join(ui_dir, base_name + '.wxss')
        
        if not os.path.exists(wxml_path):
            with open(wxml_path, 'w') as f:
                f.write(wxml_template.format(filename=filename))
            with open(wxss_path, 'w') as f:
                f.write(wxss_template)
            print(f"Generated for {base_name}")
            count += 1

print(f"Total converted: {count}")
