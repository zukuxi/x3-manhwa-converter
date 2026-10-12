X3 Manhwa Image Converter

A browser-based tool for converting manhwa, webtoons, and other comic images into XTC / XTCH files for Xteink X3 and compatible e-readers.

Features

- Batch import: Select multiple image files or import an entire folder.
- Chapter detection: Recognizes chapter folders and sorts images in natural numerical order.
- Flexible output: Export each chapter separately, merge all chapters into one book, or convert a selected chapter range.
- Batch ZIP export: Package multiple converted books into ZIP archives.
- Multiple output formats: Supports black-and-white XTC and four-level grayscale XTCH.
- Dithering options: Atkinson, Floyd–Steinberg, Sierra Lite, Ordered (Bayer 4×4), and None.
- Contrast adjustment: None, Light, Medium, Strong, and Maximum.
- Live preview: Preview the conversion effect before processing.
- Local processing: Images are processed in your browser without needing to upload them to a remote conversion server.

Page Layout

The converter uses streaming, segment-by-segment page packing. It does not create one giant canvas for an entire chapter and then slice it into pages.

1. Images are processed one at a time in natural numerical order and scaled to a width of 528 pixels.
2. Each image is divided into vertical segments as needed to fill the remaining space on the current 528 × 792 page.
3. If an image extends beyond the available space, its remaining content continues on the next page.
4. The next image can fill any remaining space on the current page.
5. When a page is full, it is output and processing continues on a new page.
6. At the end of each chapter, the final incomplete page is padded with white. The next chapter always starts on a new page.

This approach avoids creating a giant canvas for an entire chapter and avoids adding unnecessary blank space after every individual image.

Page Dimensions

- Width: 528 pixels
- Height: 792 pixels

Import and Export

Import

- Select multiple image files.
- Import an entire folder containing chapter subfolders.
- Images are sorted in natural numerical order, so filenames such as "1.jpg", "2.jpg", and "10.jpg" are handled in the expected order.

Export

Depending on the available options in the interface, you can:

- Convert each chapter into a separate book.
- Merge chapters into one book.
- Convert a selected range of chapters.
- Export multiple books in ZIP batches.

Image Processing

Dithering Algorithms

- Atkinson
- Floyd–Steinberg
- Sierra Lite
- Ordered (Bayer 4×4)
- None

Contrast Options

- None
- Light
- Medium
- Strong
- Maximum

Available options and their effects may vary depending on the selected output format.

How to Use

1. Open the web app.
2. Select image files or import a folder.
3. Choose the chapter and output mode.
4. Select XTC or XTCH and adjust the dithering and contrast settings.
5. Check the preview.
6. Start conversion and save the generated files.

Compatibility

Designed for Xteink X3 and compatible e-readers that support the generated XTC / XTCH formats.

Compatibility may depend on the target device's firmware and supported file formats.

Privacy

Image processing takes place in your browser. Images do not need to be uploaded to a remote conversion server.

Credits and License

This project is based on and adapts conversion logic from "srokl/xtcjsapp" (https://github.com/srokl/xtcjsapp), which is licensed under the MIT License.

Please refer to the original repository for its license terms. Additional code and modifications in this repository are subject to their applicable license terms.


---

X3 条漫图片转换器

一个基于浏览器的漫画转换工具，可将韩漫、条漫及其他漫画图片转换为适用于 Xteink X3 等兼容电子阅读器的 XTC / XTCH 文件。

功能特点

- 批量导入： 支持选择多个图片文件，或导入整个文件夹。
- 章节识别： 识别章节文件夹，并按自然数字顺序排列图片。
- 灵活输出： 每章单独生成文件、合并所有章节，或转换指定章节范围。
- 批量 ZIP 导出： 将多个转换结果打包为 ZIP 文件。
- 多种输出格式： 支持黑白 XTC 和四级灰度 XTCH。
- 多种抖动算法： Atkinson、Floyd–Steinberg、Sierra Lite、Ordered（Bayer 4×4）和 None。
- 对比度调整： None、Light、Medium、Strong 和 Maximum。
- 实时预览： 转换前查看效果。
- 本地处理： 图片在浏览器中处理，无需上传到远程转换服务器。

分页方式

转换器采用逐张图片、分段填充页面的方式，不会先把整章图片拼成一张超长画布再统一切割。

1. 按自然数字顺序逐张处理图片，并将图片缩放至 528 像素宽。
2. 根据当前页面的剩余空间，将图片分成适当的纵向片段，填入 528 × 792 页面。
3. 如果一张图片无法完整放入当前页面，剩余部分会继续放到下一页。
4. 下一张图片可以接着填充当前页面的剩余空间。
5. 页面填满后立即输出，并在新页面继续处理。
6. 每章结束时，最后一页不足的部分用白色补齐；下一章始终从新页面开始。

这种方式不需要创建整章的超长画布，也避免了每张图片处理完后都单独补白造成的空间浪费。

页面尺寸

- 宽度：528 像素
- 高度：792 像素

导入与导出

导入

- 选择多个图片文件。
- 导入包含章节子文件夹的整个文件夹。
- 图片按自然数字顺序排列，例如 "1.jpg"、"2.jpg"、"10.jpg" 会按预期顺序处理。

导出

根据网页界面提供的选项，可以：

- 每章单独转换为一个文件。
- 将多个章节合并为一个文件。
- 转换指定范围的章节。
- 将多个转换结果分批打包为 ZIP 文件。

图像处理

抖动算法

- Atkinson
- Floyd–Steinberg
- Sierra Lite
- Ordered（Bayer 4×4）
- None

对比度选项

- None
- Light
- Medium
- Strong
- Maximum

可用选项及其效果可能因输出格式而异。

使用方法

1. 打开网页工具。
2. 选择多个图片文件，或导入整个文件夹。
3. 选择章节及输出方式。
4. 选择 XTC 或 XTCH，并调整抖动算法和对比度。
5. 查看预览效果。
6. 开始转换并保存生成的文件。

兼容性

主要面向 Xteink X3 及支持相应 XTC / XTCH 格式的兼容电子阅读器。

实际兼容性取决于设备固件及其支持的文件格式。

隐私

图片在浏览器本地处理，无需上传至远程转换服务器。

致谢与许可

本项目参考并改编了 "srokl/xtcjsapp" (https://github.com/srokl/xtcjsapp) 的转换逻辑。原项目采用 MIT License。

原项目的许可条款请参阅其仓库。本仓库新增或修改的代码应遵守各自适用的许可条款。
