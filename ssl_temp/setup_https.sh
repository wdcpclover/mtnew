#!/bin/bash
# HTTPS 配置脚本 - 在服务器上执行

# 1. 创建 SSL 证书目录
mkdir -p /etc/nginx/ssl

# 2. 移动证书文件
mv /tmp/motizhidi.cn_bundle.crt /etc/nginx/ssl/
mv /tmp/motizhidi.cn.key /etc/nginx/ssl/

# 3. 设置正确的权限
chmod 600 /etc/nginx/ssl/motizhidi.cn.key
chmod 644 /etc/nginx/ssl/motizhidi.cn_bundle.crt

# 4. 移动 nginx 配置文件
mv /tmp/motizhidi.cn.conf /etc/nginx/conf.d/

# 5. 测试 nginx 配置
nginx -t

# 6. 如果测试通过，重启 nginx
if [ $? -eq 0 ]; then
    systemctl reload nginx
    echo "✅ HTTPS 配置成功！"
else
    echo "❌ nginx 配置有误，请检查"
fi
