
# Xteink X3 Manhwa Folder to XTC Converter

将长条韩漫（Manhwa / Webtoon）图片文件夹批量转换为适用于 **Xteink X3** 的 **XTC / XTCH** 文件。支持自动识别章节、自然数字排序、按指定章节数合并成一本书，以及在浏览器中直接保存转换结果。

**GitHub Repository:** https://github.com/zukuxi/xteink-manga-folder-to-xtc

**无需安装软件。** 图片在浏览器本地处理，无需上传到转换服务器。

## 功能特点

- **文件夹转 XTC / XTCH：** 导入包含章节子文件夹的漫画图片目录，也可以一次选择多张图片。
- **自动识别章节：** 根据文件夹结构识别章节，并按自然数字顺序排列，避免 `1, 10, 2` 这样的错误排序。
- **灵活合并章节：** 每章单独输出，或指定每几章合并成一本，例如每 5 章生成一个文件。
- **直接保存到指定文件夹：** 在支持文件夹写入的浏览器中，选择一次输出目录，完成的文件便会逐本自动保存，不必逐个确认下载。
- **ZIP 备用导出：** 浏览器不支持直接写入文件夹时，可以使用 ZIP 打包导出。
- **XTC / XTCH 输出：**
  - **XTC：** 黑白显示。
  - **XTCH：** 四级灰度显示。
- **多种抖动算法：** Atkinson、Floyd–Steinberg、Sierra Lite、Ordered (Bayer 4×4) 和 None。
- **对比度调节：** None、Light、Medium、Strong、Maximum。
- **实时预览：** 调整图像参数时查看预览效果。
- **浏览器本地处理：** 图片无需上传到服务器。

## 长条漫画分页方式

转换器逐张读取图片，并将内容连续填入固定尺寸的页面，而不是先把整章拼成一张巨大的长图再切割。

1. 将图片缩放到宽度 **528 像素**，尽可能保持原始纵横比例。
2. 按顺序处理图片，并将内容连续绘制到 **528 × 792 像素**的页面画布。
3. 当前页剩余空间可以继续容纳下一张图片的内容，不会因为源图片之间的边界而强制换页。
4. 页面填满后，执行灰度转换、抖动处理及 XTC / XTCH 编码，再继续处理剩余内容。
5. 每本书最后一页若未填满，会以白色补齐。
6. 每本书独立分页，不会把前一本书剩余的内容接到下一本书。

这种处理方式避免创建整章超长画布，并限制图像拼接阶段的临时画布尺寸。

## 批量输出与内存注意事项

例如，导入 20 个章节并设置为每 5 章一本，可以生成 4 个独立的 XTC / XTCH 文件，无需先将 20 章合并成一个巨大的 PDF。

每本书完成编码后，转换器会清理本次使用的页面缓存、画布和临时结果引用，以帮助减少连续转换时的内存占用。

请注意：

- 转换时仍需内存来读取和处理当前图片、页面及生成中的文件。
- 实际内存回收由浏览器的垃圾回收机制决定，清理引用不代表内存会立即归还给操作系统。
- 直接保存模式不会把所有已完成的输出文件持续保留在同一个 ZIP 对象中，通常更适合批量输出多本书。
- ZIP 模式需要在打包过程中保留文件数据，可能占用更多内存。
- 实际处理能力取决于浏览器、设备内存、图片尺寸、每本书包含的章节数量和输出文件大小。分批转换可以降低内存压力，但不能保证所有设备都不会崩溃。

## 输出格式

| 格式 | 显示方式 |
|---|---|
| XTC | 黑白 |
| XTCH | 四级灰度 |

## 图像处理选项

### 抖动算法

- **Atkinson：** 产生具有颗粒感的黑白效果，适合部分电子纸漫画图像。
- **Floyd–Steinberg：** 经典误差扩散算法，有助于表现灰度细节。
- **Sierra Lite：** 较轻量的误差扩散算法。
- **Ordered (Bayer 4×4)：** 使用规则网点表现不同灰度。
- **None：** 不应用抖动处理，直接按输出格式量化图像。

### 对比度

提供 None、Light、Medium、Strong 和 Maximum 五个级别。不同漫画和原图质量适合的设置可能不同，建议先查看预览再批量转换。

## 使用方法

1. 打开 [GitHub 仓库](https://github.com/zukuxi/xteink-manga-folder-to-xtc)。
2. 如果已启用 GitHub Pages，打开项目的在线转换页面。
3. 选择包含章节子文件夹的图片目录，或选择多张图片。
4. 检查章节识别结果和图片排序。
5. 选择输出格式：XTC 或 XTCH。
6. 选择章节合并方式，例如每章一本或每 5 章一本。
7. 选择抖动算法和对比度，并查看预览。
8. 开始转换。如果浏览器支持直接保存到文件夹，按提示选择一次输出目录；否则使用 ZIP 备用导出。

## 隐私

图片处理在浏览器本地完成，无需上传到服务器。在线页面及其依赖资源仍需正常加载；转换过程会使用设备的内存和处理资源。

## 许可证与致谢

本项目基于 [srokl/xtcjsapp](https://github.com/srokl/xtcjsapp) 修改和开发。原项目采用 MIT License。

感谢原作者提供开源项目。本项目在原项目基础上改进了图片批量导入、章节处理、长条漫画分页及 XTC / XTCH 转换工作流。

请按照 MIT License 的要求保留原项目的版权声明和许可证文本。详细信息请参阅 [原项目仓库](https://github.com/srokl/xtcjsapp) 中的许可证文件。

---

# Xteink X3 Manhwa Folder to XTC Converter

Batch-convert **manhwa / webtoon image folders** into **XTC / XTCH** files for the **Xteink X3**. Import chapter folders, sort images naturally, combine a chosen number of chapters into one book, and save the output directly from your browser.

**GitHub Repository:** https://github.com/zukuxi/xteink-manga-folder-to-xtc

**No installation required.** Images are processed locally in your browser and do not need to be uploaded to a conversion server.

## Features

- **Convert folders to XTC / XTCH:** Import a directory containing chapter folders, or select multiple image files.
- **Automatic chapter detection:** Detect chapters from folder structure and sort images naturally, avoiding incorrect orders such as `1, 10, 2`.
- **Flexible chapter grouping:** Export each chapter separately or combine a chosen number of chapters into one book, such as one file per five chapters.
- **Save directly to a selected folder:** In browsers that support directory writing, select the output folder once and save completed files automatically without confirming every download.
- **ZIP fallback:** Use ZIP export if the browser does not support direct folder output.
- **XTC / XTCH output:** XTC provides black-and-white output; XTCH provides four-level grayscale.
- **Multiple dithering algorithms:** Atkinson, Floyd–Steinberg, Sierra Lite, Ordered (Bayer 4×4), and None.
- **Contrast adjustment:** None, Light, Medium, Strong, and Maximum.
- **Live preview:** Preview image-processing results while adjusting settings.
- **Local browser processing:** Images do not need to be uploaded to a server.

## Long-Strip Manhwa Pagination

The converter processes images one at a time and fills fixed-size pages continuously, instead of creating one enormous canvas for an entire chapter before slicing it.

1. Resize images to **528 pixels wide**, preserving their aspect ratio as closely as possible.
2. Process images in order and draw their content onto **528 × 792 pixel** page canvases.
3. Use the remaining space on the current page for the next image's content, rather than forcing a page break at every source-image boundary.
4. Once a page is full, apply grayscale conversion, dithering, and XTC / XTCH encoding before continuing.
5. Pad the final incomplete page of each book with white.
6. Start each new book on a fresh page; leftover content from one book is never carried into the next.

This approach avoids creating a very tall canvas for an entire chapter and limits the size of temporary canvases used during image stitching.

## Batch Output and Memory Notes

For example, importing 20 chapters and setting the batch size to five chapters per book produces four separate XTC / XTCH files, without requiring all 20 chapters to be merged into one huge PDF first.

After encoding each book, the converter clears references to the page cache, canvas, and temporary results to help reduce memory use during consecutive conversions.

Please note:

- Memory is still needed to load and process the current images, pages, and output file.
- Actual memory reclamation is controlled by the browser's garbage collector; clearing references does not guarantee that memory is immediately returned to the operating system.
- Direct folder output avoids retaining all completed output files in one ZIP object and is generally better suited to batches containing multiple books.
- ZIP fallback may use more memory because files must be retained while the archive is assembled.
- Practical limits depend on the browser, device memory, image dimensions, chapters per book, and output size. Splitting a large batch can reduce memory pressure, but cannot guarantee that every device will avoid crashes.

## Output Formats

| Format | Display |
|---|---|
| XTC | Black and white |
| XTCH | Four-level grayscale |

## Image Processing Options

### Dithering Algorithms

- **Atkinson:** Produces a grainy black-and-white appearance that can work well for some e-paper comics.
- **Floyd–Steinberg:** A classic error-diffusion algorithm that helps preserve grayscale detail.
- **Sierra Lite:** A lightweight error-diffusion algorithm.
- **Ordered (Bayer 4×4):** Uses a regular halftone pattern to represent different grayscale levels.
- **None:** Disables dithering and directly quantizes the image according to the output format.

### Contrast

Choose from None, Light, Medium, Strong, and Maximum. Different comics and source-image quality may benefit from different settings, so use the preview to compare results before batch conversion.

## How to Use

1. Open the [GitHub repository](https://github.com/zukuxi/xteink-manga-folder-to-xtc).
2. Open the online converter if GitHub Pages is enabled for the project.
3. Select a folder containing chapter folders, or select multiple images.
4. Check the detected chapters and image order.
5. Choose XTC or XTCH output.
6. Choose how chapters should be grouped, such as one book per chapter or one book per five chapters.
7. Select a dithering algorithm and contrast setting, then review the preview.
8. Start conversion. If your browser supports direct folder output, select the output directory when prompted. Otherwise, use ZIP export.

## Privacy

Image processing takes place locally in the browser. Images do not need to be uploaded to a server. The online page and its dependencies still need to load, and conversion uses the device's memory and processing resources.

## License and Acknowledgments

This project is based on and modified from [srokl/xtcjsapp](https://github.com/srokl/xtcjsapp), which is licensed under the MIT License.

Thanks to the original author for making the project open source. This version improves the workflow for batch image import, chapter handling, long-strip manhwa pagination, and XTC / XTCH conversion.

Retain the original copyright notice and MIT License text as required by the license. See the [original repository](https://github.com/srokl/xtcjsapp) for the license file.
