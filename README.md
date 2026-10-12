# X3 条漫图片转换器

将条漫图片批量转换为适用于 Xteink X3 等兼容电子阅读器的 XTC / XTCH 文件。

支持批量导入图片、自动识别章节、按自然数字顺序排列、灵活合并章节，以及批量 ZIP 导出。采用逐张图片、分段填充页面的方式处理长图，避免先创建整章超长画布再切割，减少内存占用。

在线使用： https://zukuxi.github.io/x3-manhwa-converter/

主要功能

- 批量导入图片： 支持一次选择多张图片，也可以导入包含图片的文件夹。
- 自动识别章节： 根据文件夹结构识别章节，并按自然数字顺序排列图片，避免 "1、10、2" 这样的排序问题。
- 灵活处理章节： 支持每个章节单独生成文件、合并多个章节，以及选择指定范围进行转换。
- 批量 ZIP 导出： 可将生成的文件打包为 ZIP，方便一次性保存。
- 支持 XTC / XTCH：
  - XTC：黑白显示。
  - XTCH：四级灰度显示。
- 多种抖动算法： Atkinson、Floyd–Steinberg、Sierra Lite、Ordered（Bayer 4×4）和 None。
- 对比度调节： 支持 None、Light、Medium、Strong 和 Maximum。
- 实时预览： 调整图像参数时，可以查看转换效果，方便选择适合电子纸屏幕的设置。
- 浏览器本地处理： 图片转换在浏览器中完成，无需将图片上传到服务器。

长图分页方式

转换器使用逐张图片、分段处理的分页方式，而不是先将整个章节拼接成一张巨大的长图，再统一切割。

1. 将图片缩放至宽度 528 像素，同时保持原始纵横比例。
2. 按顺序逐张读取图片，并将图像内容分段填入尺寸为 528 × 792 像素 的页面。
3. 当前页面剩余的空间可以继续容纳下一张图片的内容，不会因为每张图片单独分页而产生不必要的空白。
4. 章节结束时，如果最后一页没有填满，则使用白色补齐。
5. 下一个章节从新页面开始，不会与上一章节的末尾拼接。

这种处理方式可以避免创建整章超长画布，适合批量转换包含大量长图的章节。

输出格式

格式| 显示方式
XTC| 黑白
XTCH| 四级灰度

图像处理选项

抖动算法

- Atkinson： 适合电子纸显示，呈现具有颗粒感的黑白效果。
- Floyd–Steinberg： 经典误差扩散算法，适合表现灰度细节。
- Sierra Lite： 较轻量的误差扩散算法。
- Ordered (Bayer 4×4)： 规则网点效果。
- None： 不应用抖动处理。

对比度

可选择以下级别：

- None
- Light
- Medium
- Strong
- Maximum

不同的图片、屏幕和显示环境可能适合不同的参数，可以通过实时预览进行比较。

使用方法

1. 打开在线转换页面。
2. 选择图片文件，或导入包含图片的文件夹。
3. 检查章节识别和图片排序是否正确。
4. 选择输出格式、章节处理方式、抖动算法及对比度。
5. 查看预览效果，并按需调整参数。
6. 开始转换，完成后下载生成的文件或 ZIP 压缩包。

隐私说明

图片处理在浏览器本地完成，无需将图片上传到服务器。实际使用时，浏览器仍需正常加载在线页面及其所依赖的资源。

许可证与致谢

本项目基于 "srokl/xtcjsapp" (https://github.com/srokl/xtcjsapp)（MIT License）进行修改和开发。

感谢原作者提供的开源项目。本项目在此基础上进行了针对图片批量导入、章节处理、长图分页及 XTC / XTCH 转换等方面的改进。

原项目的版权声明和 MIT 许可证文本应按照其许可要求保留。请参阅"原项目仓库" (https://github.com/srokl/xtcjsapp)中的许可证文件。

---

# X3 Image Converter

Batch-convert vertical comic images into XTC / XTCH files for Xteink X3 and compatible e-readers.

The converter supports batch image import, automatic chapter detection, natural numerical sorting, flexible chapter merging, and batch ZIP export. Long images are processed incrementally, avoiding the need to create one enormous canvas for an entire chapter before slicing it into pages.

Live demo: https://zukuxi.github.io/x3-manhwa-converter/


Features

- Batch image import: Select multiple images at once or import a folder containing images.
- Automatic chapter detection: Detect chapters from folder structures and sort images naturally by number.
- Flexible chapter handling: Export chapters separately, merge multiple chapters, or convert a selected range.
- Batch ZIP export: Package generated files into a ZIP archive for convenient downloading.
- XTC / XTCH output:
  - XTC: Black-and-white output.
  - XTCH: Four-level grayscale output.
- Multiple dithering algorithms: Atkinson, Floyd–Steinberg, Sierra Lite, Ordered (Bayer 4×4), and None.
- Contrast adjustment: None, Light, Medium, Strong, and Maximum.
- Live preview: Preview conversion results while adjusting image-processing settings.
- Local browser processing: Images are processed in the browser without uploading them to a server.

Long-Image Pagination

The converter processes images incrementally instead of creating one enormous canvas for an entire chapter before slicing it.

1. Resize each image to a width of 528 pixels while preserving its aspect ratio.
2. Process images in order and place their content into pages measuring 528 × 792 pixels.
3. Use the remaining space on the current page for the next image's content when possible.
4. Pad the final incomplete page of each chapter with white.
5. Start each new chapter on a fresh page so that content from different chapters is never combined on the same page.

This approach avoids creating extremely tall canvases and helps reduce memory usage when processing chapters containing many long images.

Output Formats

Format| Display
XTC| Black and white
XTCH| Four-level grayscale

Image Processing Options

Dithering Algorithms

- Atkinson: Produces a grainy black-and-white appearance that can work well on e-paper displays.
- Floyd–Steinberg: A classic error-diffusion algorithm for preserving grayscale detail.
- Sierra Lite: A lightweight error-diffusion algorithm.
- Ordered (Bayer 4×4): Produces a regular halftone pattern.
- None: Disables dithering.

Contrast

Available settings:

- None
- Light
- Medium
- Strong
- Maximum

Use the live preview to compare settings and choose the result best suited to your images and display.

How to Use

1. Open the online converter.
2. Select multiple image files or import a folder.
3. Check chapter detection and image ordering.
4. Choose the output format, chapter handling mode, dithering algorithm, and contrast.
5. Review the preview and adjust the settings as needed.
6. Start the conversion and download the generated files or ZIP archive.

Privacy

Image processing takes place locally in the browser. Images do not need to be uploaded to a server. The online page and its dependencies still require a network connection to load.

License and Acknowledgments

This project is based on and modified from "srokl/xtcjsapp" (https://github.com/srokl/xtcjsapp), which is licensed under the MIT License.

Thanks to the original author for making the project open source. This version adds improvements for batch image import, chapter handling, long-image pagination, and XTC / XTCH conversion.

The original copyright notice and MIT License text should be retained in accordance with the applicable license terms. Please refer to the license file in the "original repository" (https://github.com/srokl/xtcjsapp).
