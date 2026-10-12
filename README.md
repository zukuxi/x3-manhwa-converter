X3 Manhwa Image Converter

A browser-based tool for converting manhwa and other long comic images into XTC / XTCH files for Xteink X3 and compatible e-readers.

一个基于浏览器的工具，用于将韩漫、条漫及其他长图漫画转换为适用于 Xteink X3 等兼容设备的 XTC / XTCH 文件。

Features / 功能

- Batch import / 批量导入 — Select multiple images or import an entire folder.
- Chapter detection / 章节识别 — Recognizes chapter folders and sorts images in natural numerical order.
- Flexible output / 灵活输出 — Export each chapter separately, merge all chapters into one book, or convert a selected chapter range.
- Batch ZIP export / 批量 ZIP 导出 — Package multiple converted books into ZIP archives.
- XTC and XTCH / 输出格式 — Supports black-and-white XTC and four-level grayscale XTCH.
- Dithering options / 抖动算法 — Includes Atkinson, Floyd–Steinberg, Sierra Lite, Ordered (Bayer 4×4), and None.
- Contrast adjustment / 对比度调整 — Choose None, Light, Medium, Strong, or Maximum.
- Live preview / 实时预览 — Preview the conversion effect before processing.
- Browser-based processing / 浏览器本地处理 — Images are processed locally in your browser; they do not need to be uploaded to a server.

Page Layout / 分页方式

How it works / 工作原理

The converter uses streaming, segment-by-segment page packing. It does not create one giant canvas for an entire chapter before slicing it.

转换器采用逐张图片、分段填充页面的方式，不会先把整章图片拼成一张超长画布再统一切割。

1. Images are processed one at a time in natural numerical order and scaled to a width of 528 pixels.
   
   按自然数字顺序逐张处理图片，并将图片缩放至 528 像素宽。

2. Each image is divided into vertical segments as needed. The segments fill the remaining space on the current 528 × 792 page.
   
   根据当前页面的剩余空间，将图片分成适当的纵向片段，依次填入 528 × 792 页面。

3. If an image does not fit entirely in the remaining space, its unfinished portion continues on the next page. The next image can then fill any space left on the current page.
   
   如果一张图片无法完整放入当前页面，剩余部分会继续放到下一页。下一张图片也可以接着填充当前页的剩余空间。

4. When a page is full, it is emitted and processing continues on a fresh page.
   
   页面填满后立即输出，并在新页面继续处理。

5. At the end of each chapter, the final incomplete page is padded with white. The next chapter always starts on a new page.
   
   每章结束时，最后一页不足的部分用白色补齐。下一章始终从新页面开始。

This approach avoids creating a giant canvas for an entire chapter and avoids adding unnecessary blank space after every individual image.

这种方式既避免了创建整章的超长画布，也避免了每张图片处理完后都单独补白造成的空间浪费。

Page dimensions / 页面尺寸

- Width / 宽度: 528 pixels
- Height / 高度: 792 pixels

Import and Export / 导入与导出

Import / 导入

- Select multiple image files.
- Import an entire folder containing chapter subfolders.
- Images are sorted in natural numerical order, so names such as "1.jpg", "2.jpg", "10.jpg" are handled in the expected order.

Export / 导出

Depending on the available options in the interface, you can:

- Convert each chapter into a separate book.
- Merge chapters into one book.
- Convert a selected range of chapters.
- Export multiple books in ZIP batches.

Image Processing / 图像处理

Dithering algorithms / 抖动算法

- Atkinson
- Floyd–Steinberg
- Sierra Lite
- Ordered (Bayer 4×4)
- None

Contrast / 对比度

- None
- Light
- Medium
- Strong
- Maximum

Available options and their effects may vary depending on the selected output format.

不同输出格式下，可用选项及其效果可能有所不同。

How to Use / 使用方法

1. Open the web app.
2. Select image files or import a folder.
3. Choose the chapter and output mode.
4. Select XTC or XTCH, then adjust the dithering and contrast settings.
5. Check the preview.
6. Start conversion and save the generated files.

中文步骤

1. 打开网页工具。
2. 选择多个图片文件，或导入包含章节子文件夹的文件夹。
3. 选择章节及输出方式。
4. 选择 XTC 或 XTCH，并调整抖动算法和对比度。
5. 查看预览效果。
6. 开始转换并保存生成的文件。

Compatibility / 兼容性

Designed for Xteink X3 and compatible e-readers that support the generated XTC / XTCH formats.

主要面向 Xteink X3 及支持相应 XTC / XTCH 格式的兼容电子阅读器。

Compatibility may depend on the target device's firmware and supported file formats.

实际兼容性取决于设备固件及其支持的文件格式。

Privacy / 隐私

Image processing takes place in the browser. Images do not need to be uploaded to a remote conversion server.

图片在浏览器本地处理，无需上传至远程转换服务器。

Credits and License / 致谢与许可

This project is based on the original conversion approach and encoding logic from "srokl/xtcjsapp" (https://github.com/srokl/xtcjsapp), which is licensed under the MIT License. This project adapts and extends the original work.

本项目参考并改编了 "srokl/xtcjsapp" (https://github.com/srokl/xtcjsapp) 的转换思路及编码逻辑。原项目采用 MIT License，本项目在此基础上进行了适配与扩展。

Please refer to the original repository for its license terms. Any additional code or modifications in this repository remain subject to their applicable license terms.

原项目的许可条款请参阅其仓库。本仓库新增或修改的代码应遵守各自适用的许可条款。

Version History / 版本记录

V2.1

Initial version of the converter.

转换器的初始版本。

V2.8

Improved chapter handling and page generation.

改进章节处理及页面生成。

V2.9

Further improvements to the conversion workflow and interface.

进一步改进转换流程及界面。

---

Note / 注意： This README describes the current page-packing behavior: images are processed sequentially, their vertical segments fill the current page, and only the final incomplete page of each chapter is padded with white.

本 README 描述的是当前实际分页逻辑：图片按顺序逐张处理，纵向片段依次填充当前页面，并且只有每章最后一张未填满的页面会用白色补齐。
