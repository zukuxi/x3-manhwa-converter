
# X3 条漫图片转换器

将条漫图片批量转换为适用于 Xteink X3 等兼容电子阅读器的 XTC / XTCH 文件。

本项目基于浏览器运行，支持批量导入图片、自动识别章节、自然数字排序、灵活合并章节，以及批量 ZIP 导出。采用逐张图片、分段填充页面的方式处理长图，无需预先创建整章超长画布。

**在线使用：** https://zukuxi.github.io/x3-manhwa-converter/

## 主要功能

- **批量导入图片：** 支持一次选择多张图片，也可以导入包含图片的文件夹。
- **自动识别章节：** 根据文件夹结构识别章节，并按自然数字顺序排列图片，避免 `1、10、2` 这样的排序问题。
- **灵活处理章节：** 支持每个章节单独生成文件、合并多个章节，以及选择指定范围进行转换。
- **批量 ZIP 导出：** 将生成的多个文件打包为 ZIP，方便一次性下载和保存。
- **支持 XTC / XTCH：**
  - **XTC：** 黑白显示。
  - **XTCH：** 四级灰度显示。
- **多种抖动算法：** Atkinson、Floyd–Steinberg、Sierra Lite、Ordered（Bayer 4×4）和 None。
- **对比度调节：** 支持 None、Light、Medium、Strong 和 Maximum 五个级别。
- **实时预览：** 调整图像参数时，可以查看预览效果，便于选择适合电子纸屏幕的设置。
- **浏览器本地处理：** 图片转换在浏览器中完成，无需将图片上传到服务器。

## 长图分页方式

转换器采用逐张读取图片、分段填充固定尺寸页面的方式处理条漫，而不是先将整个章节拼接成一张巨大的长图，再统一切割。

处理流程如下：

1. 将图片缩放至宽度 528 像素，并尽可能保持原始纵横比例。
2. 按顺序逐张读取图片，将图片内容连续绘制到尺寸为 528 × 792 像素的页面画布。
3. 当前页面剩余的空间可以继续容纳下一张图片的内容，不会因为原始图片文件之间的边界而强制分页。
4. 页面填满后，对该页执行灰度转换、抖动处理及 XTC / XTCH 编码，然后继续处理剩余内容。
5. 每个章节结束时，如果最后一页没有填满，则使用白色补齐。
6. 下一个章节从新页面开始，避免不同章节的内容拼接到同一页。

这种方式避免了创建整章超长画布，并限制了图像拼接阶段的临时画布尺寸，适合处理包含大量图片的长篇条漫。

实际可处理的图片数量仍取决于浏览器、设备内存、图片尺寸和最终输出文件大小。

## 输出格式

| 格式 | 显示方式 |
|---|---|
| XTC | 黑白 |
| XTCH | 四级灰度 |

## 图像处理选项

### 抖动算法

- **Atkinson：** 产生具有颗粒感的黑白效果，适合部分电子纸漫画图像。
- **Floyd–Steinberg：** 经典误差扩散算法，有助于保留灰度细节。
- **Sierra Lite：** 较轻量的误差扩散算法。
- **Ordered (Bayer 4×4)：** 使用规则网点表现不同灰度。
- **None：** 不应用抖动处理，直接按照输出格式进行量化。

### 对比度

可选择以下级别：

- None
- Light
- Medium
- Strong
- Maximum

不同漫画、原图质量和显示环境可能适合不同参数。建议使用实时预览进行比较，再开始批量转换。

## 使用方法

1. 打开[在线转换页面](https://zukuxi.github.io/x3-manhwa-converter/)。
2. 选择多张图片，或导入包含图片的文件夹。
3. 检查章节识别结果和图片排序是否正确。
4. 选择输出格式、章节处理方式、抖动算法及对比度。
5. 查看预览效果，并按需调整参数。
6. 开始转换，完成后下载生成的文件或 ZIP 压缩包。

## 隐私说明

图片处理在浏览器本地完成，无需将图片上传到服务器。在线页面及其依赖资源仍需正常加载；转换过程中，浏览器会使用设备的内存和处理资源。

## 许可证与致谢

本项目基于 [srokl/xtcjsapp](https://github.com/srokl/xtcjsapp) 修改和开发。原项目采用 MIT License。

感谢原作者提供的开源项目。本项目在原项目基础上进行了针对图片批量导入、章节处理、长图分页及 XTC / XTCH 转换等方面的改进。

请按照 MIT License 的要求保留原项目的版权声明和许可证文本。详细信息请参阅[原项目仓库](https://github.com/srokl/xtcjsapp)中的许可证文件。

---

# X3 Image Converter

Batch-convert vertical comic images into XTC / XTCH files for Xteink X3 and compatible e-readers.

This browser-based tool supports batch image import, automatic chapter detection, natural numerical sorting, flexible chapter merging, and batch ZIP export. Long images are processed incrementally into fixed-size pages without first creating one enormous canvas for an entire chapter.

**Live demo:** https://zukuxi.github.io/x3-manhwa-converter/

## Features

- **Batch image import:** Select multiple image files at once or import a folder containing images.
- **Automatic chapter detection:** Detect chapters from folder structures and sort images naturally by number, avoiding ordering issues such as `1, 10, 2`.
- **Flexible chapter handling:** Export chapters separately, merge multiple chapters into one book, or convert a selected range.
- **Batch ZIP export:** Package multiple generated files into a ZIP archive for convenient downloading.
- **XTC / XTCH output:**
  - **XTC:** Black-and-white output.
  - **XTCH:** Four-level grayscale output.
- **Multiple dithering algorithms:** Atkinson, Floyd–Steinberg, Sierra Lite, Ordered (Bayer 4×4), and None.
- **Contrast adjustment:** Five settings: None, Light, Medium, Strong, and Maximum.
- **Live preview:** Preview image-processing results while adjusting the settings.
- **Local browser processing:** Images are processed in the browser without being uploaded to a server.

## Long-Image Pagination

The converter processes images one at a time and fills fixed-size pages incrementally, instead of creating a single enormous canvas for an entire chapter before slicing it.

1. Resize each image to a width of 528 pixels while preserving its aspect ratio as closely as possible.
2. Process images in order and draw their content continuously onto a 528 × 792 pixel page canvas.
3. Use the remaining space on the current page for the next image's content instead of forcing a page break at every source-image boundary.
4. Once a page is full, convert it to grayscale, apply dithering, and encode it as XTC / XTCH before continuing.
5. Pad the final incomplete page of each chapter with white.
6. Start each new chapter on a fresh page so that content from different chapters is not combined on the same page.

This approach avoids creating an extremely tall canvas for an entire chapter and limits the size of temporary canvases used during image stitching. It is suitable for long-form comics containing large numbers of images.

The practical limits still depend on the browser, available device memory, source-image dimensions, and final output size.

## Output Formats

| Format | Display |
|---|---|
| XTC | Black and white |
| XTCH | Four-level grayscale |

## Image Processing Options

### Dithering Algorithms

- **Atkinson:** Produces a grainy black-and-white appearance that can work well for some e-paper comic images.
- **Floyd–Steinberg:** A classic error-diffusion algorithm that helps preserve grayscale detail.
- **Sierra Lite:** A lightweight error-diffusion algorithm.
- **Ordered (Bayer 4×4):** Uses a regular halftone pattern to represent different grayscale levels.
- **None:** Disables dithering and directly quantizes the image according to the output format.

### Contrast

Available settings:

- None
- Light
- Medium
- Strong
- Maximum

Different comics, source-image quality, and display conditions may benefit from different settings. Use the live preview to compare results before starting a batch conversion.

## How to Use

1. Open the [online converter](https://zukuxi.github.io/x3-manhwa-converter/).
2. Select multiple image files or import a folder.
3. Check the detected chapters and image ordering.
4. Choose the output format, chapter-handling mode, dithering algorithm, and contrast.
5. Review the preview and adjust the settings as needed.
6. Start the conversion, then download the generated files or ZIP archive.

## Privacy

Image processing takes place locally in the browser. Images do not need to be uploaded to a server. The online page and its dependencies still need to load normally, and conversion uses the browser's available memory and processing resources.

## License and Acknowledgments

This project is based on and modified from [srokl/xtcjsapp](https://github.com/srokl/xtcjsapp), which is licensed under the MIT License.

Thanks to the original author for making the project open source. This version adds improvements for batch image import, chapter handling, long-image pagination, and XTC / XTCH conversion.

The original copyright notice and MIT License text must be retained in accordance with the applicable license terms. Please refer to the [original repository](https://github.com/srokl/xtcjsapp) for the license file.
