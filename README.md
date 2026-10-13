
# X3 条漫图片转换器

将条漫图片批量转换为适用于 Xteink X3 的 XTC / XTCH 文件。

本项目基于浏览器运行，支持批量导入图片、自动识别章节、自然数字排序、灵活合并章节，以及批量输出。采用逐张图片、分段填充页面的方式处理长图，无需预先创建整章超长画布。

**在线使用：** https://zukuxi.github.io/x3-manhwa-converter/

## 主要功能

- **批量导入图片：** 支持一次选择多张图片，也可以导入包含图片的文件夹。
- **自动识别章节：** 根据文件夹结构识别章节，并按自然数字顺序排列图片，避免 `1、10、2` 这样的排序问题。
- **灵活合并章节：** 可以每章单独生成一本，也可以将指定数量的章节合并为一本，例如每 5 章生成一个 XTC 文件。
- **直接保存到文件夹：** 在支持文件夹写入的浏览器中，只需选择一次输出文件夹，生成的文件便会逐本自动保存，无需每本单独确认下载。
- **ZIP 备用导出：** 如果浏览器不支持直接写入输出文件夹，则使用 ZIP 打包导出。
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
5. 每本书结束时，如果最后一页没有填满，则使用白色补齐。
6. 下一本书从新页面开始，不会把前一本书剩余的内容拼接到下一本书。

这种方式避免了创建整章超长画布，并限制了图像拼接阶段的临时画布尺寸，适合处理包含大量图片的长篇条漫。

## 分本转换与内存管理

转换器支持将多章条漫按指定数量合并成一本书，并逐本生成输出文件。

例如，将 20 个章节设置为每 5 章一本，可以生成 4 个独立的 XTC / XTCH 文件，而不是必须先把 20 章合并成一个巨大的 PDF。

每本书完成编码后，程序会清理本次转换使用的页面缓存、画布及临时结果引用，再继续处理下一本，以减少连续转换时的内存占用。

**需要注意：**

- 转换过程中仍然需要内存来读取和处理当前图片、页面及生成中的文件。
- 程序清理缓存后，实际内存回收由浏览器的垃圾回收机制决定，内存不一定会立即归还给操作系统。
- 直接保存模式不会像 ZIP 备用模式那样将所有已完成的输出文件持续保留在一个 ZIP 对象中，因此通常更适合批量生成多本书。
- ZIP 备用模式需要在打包过程中保留待下载的文件数据，批量输出较大时可能需要更多内存。
- 实际可处理的图片数量仍取决于浏览器、设备内存、图片尺寸、合并章节数量和最终输出文件大小。分批生成可以降低内存压力，但不能保证所有设备都不会发生崩溃。

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
2. 选择多张图片，或导入包含章节文件夹的目录。
3. 检查章节识别结果和图片排序是否正确。
4. 选择输出格式及章节合并方式，例如每章一本或每 5 章一本。
5. 选择抖动算法和对比度，并查看预览效果。
6. 开始转换。
7. 如果浏览器支持直接保存到文件夹，按提示选择一次输出目录即可，生成的文件会逐本保存；否则，转换器会使用 ZIP 备用导出方式。

建议批量转换大量章节时，按合适的数量分本生成，避免单本文件过大给浏览器带来过高的内存压力。

## 隐私说明

图片处理在浏览器本地完成，无需将图片上传到服务器。在线页面及其依赖资源仍需正常加载；转换过程中，浏览器会使用设备的内存和处理资源。

## 许可证与致谢

本项目基于 [srokl/xtcjsapp](https://github.com/srokl/xtcjsapp) 修改和开发。原项目采用 MIT License。

感谢原作者提供的开源项目。本项目在原项目基础上进行了针对图片批量导入、章节处理、长图分页及 XTC / XTCH 转换等方面的改进。

请按照 MIT License 的要求保留原项目的版权声明和许可证文本。详细信息请参阅[原项目仓库](https://github.com/srokl/xtcjsapp)中的许可证文件。

---

# X3 Image Converter

Batch-convert vertical comic images into XTC / XTCH files for Xteink X3.

This browser-based tool supports batch image import, automatic chapter detection, natural numerical sorting, flexible chapter merging, and batch output. Long images are processed incrementally into fixed-size pages without first creating one enormous canvas for an entire chapter.

**Live demo:** https://zukuxi.github.io/x3-manhwa-converter/

## Features

- **Batch image import:** Select multiple image files at once or import a folder containing images.
- **Automatic chapter detection:** Detect chapters from folder structures and sort images naturally by number, avoiding ordering issues such as `1, 10, 2`.
- **Flexible chapter merging:** Export each chapter separately or merge a specified number of chapters into one book, such as one XTC file for every five chapters.
- **Direct folder output:** On browsers that support writing to a selected directory, choose the output folder once and save completed files there automatically, without confirming each download separately.
- **ZIP fallback:** Browsers without direct folder-writing support use ZIP export instead.
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
5. Pad the final incomplete page of each book with white.
6. Start each new book on a fresh page so that content from different books is not combined on the same page.

This approach avoids creating an extremely tall canvas for an entire chapter and limits the size of temporary canvases used during image stitching.

## Batch Conversion and Memory Management

The converter can merge a specified number of chapters into each book and generate output files one book at a time.

For example, setting a batch of 20 chapters to five chapters per book produces four separate XTC / XTCH files, rather than requiring all 20 chapters to be merged into one enormous PDF first.

After encoding each book, the converter clears the page cache, canvas, and temporary result references before proceeding to the next book. This helps reduce memory usage during consecutive conversions.

**Important notes:**

- Memory is still required to load and process the current images, pages, and output file.
- Actual memory reclamation is controlled by the browser's garbage collector. Clearing references does not guarantee that memory is immediately returned to the operating system.
- Direct folder output avoids retaining all completed output files in a single ZIP object, as happens in ZIP fallback mode, and is generally better suited to batches containing many books.
- ZIP fallback may require more memory because the output files must be retained while the archive is assembled.
- Practical limits depend on the browser, available device memory, image dimensions, number of chapters per book, and output file size. Splitting a large batch into multiple books can reduce memory pressure, but cannot guarantee that every device will avoid crashes.

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
2. Select multiple image files or import a folder containing chapter folders.
3. Check the detected chapters and image ordering.
4. Choose the output format and chapter-merging mode, such as one book per chapter or one book per five chapters.
5. Select the dithering algorithm and contrast, then review the preview.
6. Start the conversion.
7. If the browser supports direct folder output, select the output directory when prompted. Completed files will be saved there one by one. Otherwise, the converter uses ZIP fallback export.

For large batches, consider generating several smaller books instead of one oversized book to reduce browser memory pressure.

## Privacy

Image processing takes place locally in the browser. Images do not need to be uploaded to a server. The online page and its dependencies still need to load normally, and conversion uses the browser's available memory and processing resources.

## License and Acknowledgments

This project is based on and modified from [srokl/xtcjsapp](https://github.com/srokl/xtcjsapp), which is licensed under the MIT License.

Thanks to the original author for making the project open source. This version adds improvements for batch image import, chapter handling, long-image pagination, and XTC / XTCH conversion.

The original copyright notice and MIT License text must be retained in accordance with the applicable license terms. Please refer to the [original repository](https://github.com/srokl/xtcjsapp) for the license file.
