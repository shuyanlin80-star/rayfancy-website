#!/usr/bin/env zsh
set -euo pipefail

SRC_ROOT="/Users/lzk/RFC 建站资料/网站替换图片"
PROJECT_ROOT="/Users/lzk/AI/RFCweb"

convert_to_targets() {
  local src="$1"
  local rel="$2"
  local ext="${rel##*.}"
  local fmt="jpeg"

  if [[ "$ext" == "png" ]]; then
    fmt="png"
  fi

  for base in "public" "dist"; do
    local dest="$PROJECT_ROOT/$base/$rel"
    mkdir -p "$(dirname "$dest")"
    sips -s format "$fmt" "$src" --out "$dest" >/dev/null
  done
}

convert_to_targets "$SRC_ROOT/产品应用场景图/Create_a_premium_website_hero_202606080007.jpeg" "assets/products/silver-switch-hero.jpg"
convert_to_targets "$SRC_ROOT/产品极致特写图/Create_an_ultra-detailed_macro_product_202606080004.jpeg" "assets/products/product-macro-hero.jpg"
convert_to_targets "$SRC_ROOT/产品应用场景图/Create_a_high-end_luxury_interior_202606080008.jpeg" "assets/products/application-scene.jpg"
convert_to_targets "$SRC_ROOT/产品页产品图/帮我生成一张电商级别的产品组合图，产品不要发生任何改变_4K_202606082309.jpeg" "assets/products/a6-1gang-switch.jpg"
convert_to_targets "$SRC_ROOT/产品页产品图/帮我生成一张高级的产品电商组合图，产品形状不要发生任何改变_4K_202606082310.jpeg" "assets/products/a6-2gang-switch.jpg"
convert_to_targets "$SRC_ROOT/产品页产品图/序列 01.00_11_00_00.Still095.png" "assets/products/a6-3gang-switch.jpg"
convert_to_targets "$SRC_ROOT/产品页产品图/序列 01.00_11_05_00.Still098.png" "assets/products/a6-thailand-socket.jpg"
convert_to_targets "$SRC_ROOT/产品页产品图/序列 01.00_07_41_09.Still059.png" "assets/products/a6-switch-socket-combo.jpg"
convert_to_targets "$SRC_ROOT/产品页产品图/序列 01.00_05_45_00.Still040.png" "assets/products/a6-double-socket.jpg"
convert_to_targets "$SRC_ROOT/产品极致特写图/Create_an_ultra-detailed_macro_product_202606080001.jpeg" "assets/products/a6-double-thailand-socket.jpg"
convert_to_targets "$SRC_ROOT/产品极致特写图/Create_an_ultra-detailed_macro_product_202606072356.jpeg" "assets/products/power-strip-switch.jpg"
convert_to_targets "$SRC_ROOT/产品极致特写图/Create_an_ultra-detailed_macro_product_202606080004.jpeg" "assets/products/round-power-strip.jpg"
convert_to_targets "$SRC_ROOT/产品极致特写图/Create_an_ultra-detailed_macro_product_202606080004.jpeg" "assets/products/double-round-power-strip.jpg"
convert_to_targets "$SRC_ROOT/产品极致特写图/Create_an_ultra-detailed_macro_product_202606072358.jpeg" "assets/products/lamp-holder.jpg"
convert_to_targets "$SRC_ROOT/产品应用场景图/Create_a_premium_close-up_lifestyle_202606080003.jpeg" "assets/products/three-pin-plug.jpg"
convert_to_targets "$SRC_ROOT/产品应用场景图/Create_a_premium_close-up_lifestyle_202606080002.jpeg" "assets/products/two-pin-plug.jpg"

convert_to_targets "$SRC_ROOT/工厂图片/去掉图片左上角_logo_4K_202606082236.jpeg" "assets/company/injection-workshop.jpg"
convert_to_targets "$SRC_ROOT/工厂图片/把画面里衣服的红色部分改成蓝色_4K_202606082242.jpeg" "assets/company/mold-design.jpg"
convert_to_targets "$SRC_ROOT/工厂图片/去掉图片左上角的_logo_以及底下的英文字幕_4K_202606082240.jpeg" "assets/company/testing.jpg"
convert_to_targets "$SRC_ROOT/工厂图片/去掉画面左上角的_logo_4K_202606082243.jpeg" "assets/company/copper-parts.jpg"
convert_to_targets "$SRC_ROOT/工厂图片/去掉图片左上角的_logo_4K_202606082235.jpeg" "assets/company/packing-workshop.jpg"
convert_to_targets "$SRC_ROOT/工厂图片/06e299d96eceb307713b2957b5d4ddfd150dbdece3d2055217b17ea474c8824e.jpeg" "assets/company/office.jpg"
convert_to_targets "$SRC_ROOT/工厂图片/去掉图片左上角的_logo_以及底部的英文字幕_4K_202606082244.jpeg" "assets/company/product-assembly.jpg"

echo "Site images replaced."
