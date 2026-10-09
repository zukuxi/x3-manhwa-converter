# X3 Manga Image Converter V2.5

A browser-based JPG/PNG manga folder to Xteink X3 XTC/XTCH converter.

## Features
- Select a manga folder and sort chapter folders / image filenames naturally.
- Merge all chapters into one book, export one book per chapter, or merge a chosen chapter range.
- Package chapter books into ZIP files in batches of 5 or 10 (JSZip is loaded from jsDelivr).
- Convert tall images into 528×792 pages.
- Black-and-white XTC or 4-gray XTCH output.
- Images are processed locally in the browser; they are not uploaded.

## GitHub Pages
Upload `index.html`, `app.js`, and this README to the repository root. In Settings → Pages, publish from the `main` branch and `/ (root)`.

## Important
- Folder selection support varies by browser/device. If folder selection is unavailable, multi-file selection may lose chapter folder structure.
- ZIP mode requires internet access to load JSZip from jsDelivr.
- Test output on an Xteink X3 using a small sample before converting a large collection. File format compatibility and large-book memory use are not guaranteed.
- This project adapts encoding logic from `srokl/xtcjsapp` (MIT); preserve applicable license and attribution notices when redistributing.


## V2.1 修正
- 默认输出模式改为“每章单独一本”，并默认每 5 本一个 ZIP。
- 选择文件夹后显示识别到的章节数。
- 若浏览器没有提供目录路径、无法识别章节文件夹，分章/范围模式会明确报错，不再悄悄生成一本合并文件。

## V2.5 条漫拼接修正
- 不再把每张 JPG 独立切页；每章内的图片按自然顺序纵向连续拼接，再切成 528×792 页面。
- 图片之间不会强行插入白页；只有整章/整本最后一页不足 792 像素时，才在末尾补白。
- 采用逐段绘制的流式拼接方式，不创建整章超长大画布，以减少内存峰值。
